/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Schema = mongoose.model('Schema');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	Schema.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('schema/index', {schemas: data});
	});
};

exports.new = function (req,res) {
	res.render('schema/new');
};

exports.create = function (req, res) {
	var schema = new Schema(req.body);

	schema.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.redirect('/schema');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Schema.findById(req.params.schemaId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('schema/edit', {schema: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	Schema.findById(req.params.schemaId, function (err, schema) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		schema = extend(schema, req.body);
		schema.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/schema');
		});
	});
};

exports.delete = function (req, res) {
	Schema.findByIdAndRemove(req.params.schemaId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

