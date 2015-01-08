/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Workflow = mongoose.model('Workflow');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	Workflow.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('workflow/index', {workflows: data});
	});
};

exports.new = function (req,res) {
	res.render('workflow/new');
};

exports.create = function (req, res) {
	var workflow = new Workflow(req.body);

	workflow.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.redirect('/workflow');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Workflow.findById(req.params.workflowId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('workflow/edit', {workflow: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	Workflow.findById(req.params.workflowId, function (err, workflow) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		workflow = extend(workflow, req.body);
		workflow.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/workflow');
		});
	});
};

exports.delete = function (req, res) {
	Workflow.findByIdAndRemove(req.params.workflowId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

