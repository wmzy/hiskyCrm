/**
 * Module dependencies.
 */

var extend = require('util')._extend;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var OrganizationNode = mongoose.model('OrganizationNode');
var async = require('async');
var winston = require('winston');
var utils = require('../../lib/utils');

/**
 * Load
 */

exports.load = function (req, res, next, id) {
	var options = {
		criteria: {_id: id}
	};
	User.load(options, function (err, user) {
		if (err) return res.json(422, err); //next(err);
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Create user
 */

exports.create = function (req, res) {
	req.body.jobPosition = req.body.jobPosition || undefined;
	var user = new User(req.body);
	user.save(function (err) {
		if (err) {
			winston.error(err);
			return res.json(422, err);
		}

		// manually login the user once successfully signed up
		res.json(user);
	});
};

exports.update = function (req, res) {
	delete req.body.username;

	async.waterfall([function (callback) {
		User.findById(req.params.userId, callback);
	}, function (user, callback) {
		user = extend(user, req.body);
		user.save(callback);
	}], function (err, user) {
		if (err) {
			winston.error(err);
			return res.json(422, {err: err});
		}
		return res.json(user);
	});
};

exports.delete = function (req, res) {
	User.findByIdAndRemove(req.params.userId, function (err) {
		if (err) {
			winston.error(err);
			return res.json(422, err);
		}

		res.send(200);
	});
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
	var user = req.profile;
	res.render('users/show', {
		title: user.name,
		user: user
	});
};

exports.manage = function (req, res, next) {
	async.parallel([function (callback) {
		OrganizationNode.find(callback);
	}, function (callback) {
		User.find(callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('users/manage', {orgNodes: results[0], users: results[1]});
	});
};

exports.search = function (req, res) {
	console.log(req.params.query);
	User.find(
		// {$text: {$search: req.params.query}},
		// {score: {$meta: 'textScore'}}
	)// .sort({score: {$meta: 'textScore'}})
		.exec(function (err, users) {
			if (err) {
				console.log(err);
				winston.error(err);
				return res.json(422, err);
			}

			res.json(users);
		});
};

exports.signin = function (req, res, next) {
	var user = new User(req.body);
	user.provider = 'local';
	user.save(function (err) {
		if (err) {
			return res.render('users/signup', {
				error: utils.errors(err.errors),
				user: user,
				title: 'Sign up'
			});
		}

		// manually login the user once successfully signed up
		req.logIn(user, function (err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	});
};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
	res.render('users/login', {
		title: 'Login'
	});
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		user: new User()
	});
};

/**
 * Logout
 */

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login(req, res) {
	var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
	delete req.session.returnTo;
	res.redirect(redirectTo);
}
