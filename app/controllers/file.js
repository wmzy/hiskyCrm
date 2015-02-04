/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var File = mongoose.model('File');
var User = mongoose.model('User');

exports.download = function (req, res, next) {
	File.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('file/index', {files: data});
	});
};

exports.get = function (req,res) {
	res.render('file/new');
};

exports.upload = function (req, res) {
	var file = new File(req.body);

	file.save(function (err) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}

		res.redirect('/file');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		File.findById(req.params.fileId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('file/edit', {file: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	File.findById(req.params.fileId, function (err, file) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		file = extend(file, req.body);
		file.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/file');
		});
	});
};

exports.delete = function (req, res) {
	File.findByIdAndRemove(req.params.fileId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

