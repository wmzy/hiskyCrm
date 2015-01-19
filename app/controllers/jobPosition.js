/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var JobPosition = mongoose.model('JobPosition');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	JobPosition.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('jobPosition/index', {jobPositions: data});
	});
};

exports.new = function (req,res) {
	res.render('jobPosition/new');
};

exports.create = function (req, res) {
	var jobPosition = new JobPosition(req.body);

	jobPosition.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.json(jobPosition);
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		JobPosition.findById(req.params.jobPositionId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('jobPosition/edit', {jobPosition: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	JobPosition.findById(req.params.jobPositionId, function (err, jobPosition) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		jobPosition = extend(jobPosition, req.body);
		jobPosition.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/jobPosition');
		});
	});
};

exports.delete = function (req, res) {
	JobPosition.findByIdAndRemove(req.params.jobPositionId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

