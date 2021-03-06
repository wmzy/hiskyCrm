/**
 * Module dependencies.
 */
'use strict';
var express = require('express');
var favicon = require('serve-favicon');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var methodOverride = require('method-override');
var csrf = require('csurf');
var multer = require('multer');
var swig = require('swig');

var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
var helpers = require('view-helpers');
var config = require('config');
var pkg = require('../package.json');
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');

var env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function (app, passport) {

	app.use(favicon(config.root + '/public/favicon.ico'));

	// Compression middleware (should be placed before express.static)
	app.use(compression({
		threshold: 512
	}));

	// Static files middleware
	app.use(express.static(config.root + '/public'));

	// Use winston on production
	var log;
	if (env !== 'development') {
		log = {
			stream: {
				write: function (message) {
					winston.info(message);
				}
			}
		};
	} else {
		log = 'dev';
	}

	// Don't log during tests
	// Logging middleware
	if (env !== 'test') app.use(morgan(log));

	// Swig templating engine settings
	if (env === 'development' || env === 'test') {
		swig.setDefaults({
			cache: false
		});
	}

	// set views path, template engine and default layout
	app.engine('html', swig.renderFile);
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	// expose package.json to views
	app.use(function (req, res, next) {
		res.locals.pkg = pkg;
		res.locals.env = env;
		next();
	});

	// bodyParser should be above methodOverride
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(/^(?!\/file)/, multer());
	app.use('/file*', multer({
		dest: config.root + '/files',
		limits: {
			files: 1,
			fields: 1
		},
		rename: function () {
			var newName = uuid.v4().replace(/(..)(\w+)-(\w+)-(\w+)-(\w+)-(\w+)/, '$1/$2$3$4$5$6');
			var path = config.root + '/files/' + newName.split('/')[0];
			mkdirp.sync(path);
			return newName;
		}
	}));
	app.use(methodOverride(function (req) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	}));

	// 验证
	app.use(validator());

	// CookieParser should be above session
	app.use(cookieParser());
	app.use(cookieSession({secret: 'secret'}));
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: pkg.name,
		store: new mongoStore({
			url: config.db,
			collection: 'sessions'
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages - should be declared after sessions
	app.use(flash());

	// should be declared after session and flash
	app.use(helpers(pkg.name));

	// adds CSRF support
	if (process.env.NODE_ENV !== 'test') {
		app.use(csrf());

		// This could be moved to view-helpers :-)
		app.use(function (req, res, next) {
			res.locals.csrf_token = req.csrfToken();
			next();
		});
	}
};
