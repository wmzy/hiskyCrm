/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Installation = mongoose.model('Installation');
var User = mongoose.model('User');

exports.task = function (req, res, next) {
	Installation.find()
		.populate('creator', 'name')
		.exec(function (err, installations) {
			if (err) {
				winston.error(err);
				return next(err);
			}
			res.render('installation/task', {installations: installations});
		});
};

exports.newTask = function (req, res) {
	res.render('installation/newTask');
};

exports.createTask = function (req, res) {
	req.body.creator = req.user;
	var installation = new Installation(req.body);

	installation.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.redirect('/machine/installation/task');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Installation.findById(req.params.installationId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('installation/edit', {installation: results[1], users: results[0]});
	});
};

exports.updateTask = function (req, res, next) {
	Installation.findById(req.params.installationId, function (err, installation) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		installation = extend(installation, req.body);
		installation.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/installation');
		});
	});
};

exports.delete = function (req, res) {
	Installation.findByIdAndRemove(req.params.installationId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

