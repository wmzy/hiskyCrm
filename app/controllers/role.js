/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Role = mongoose.model('Role');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	Role.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('role/index', {roles: data});
	});
};

exports.new = function (req,res) {
	res.render('role/new');
};

exports.create = function (req, res) {
	var role = new Role(req.body);

	role.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.json(role);
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Role.findById(req.params.roleId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('role/edit', {role: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	Role.findById(req.params.roleId, function (err, role) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		role = extend(role, req.body);
		role.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/role');
		});
	});
};

exports.delete = function (req, res) {
	Role.findByIdAndRemove(req.params.roleId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

