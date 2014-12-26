/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Group = mongoose.model('Group');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	Group.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('group/index', {groups: data});
	});
};

exports.new = function (req,res) {
	res.render('group/new');
};

exports.create = function (req, res) {
	var group = new Group(req.body);

	group.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.redirect('/group');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Group.findById(req.params.groupId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('group/edit', {group: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	Group.findById(req.params.groupId, function (err, group) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		group = extend(group, req.body);
		group.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/group');
		});
	});
};

exports.delete = function (req, res) {
	Group.findByIdAndRemove(req.params.groupId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

