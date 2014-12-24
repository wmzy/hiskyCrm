/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Group = mongoose.model('Group');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

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

exports.edit = function (req, res) {
	Group.findById(req.params.groupId)
		.exec(function (err, group) {
			if (err) {
				winston.error(err);
				return next(err);
			}

			res.render(group, 'group/editor');
		});
};

exports.update = function (req, res) {
	Group.findById(req.params.groupId, function (err, group) {
		if (err)
			res.flash('err', err);

		if (group.parent && group.parent !== req.body.parent) {
			return req.flash('err', '父节点出错');
		}
		group.name = req.body.name;
		group.type = req.body.type;
		group.manager = req.body.manager || undefined;

		group.save(function (err) {
			if (err) {
				req.flash('err', err);
				return res.json(err);
			}

			res.json(group);
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

