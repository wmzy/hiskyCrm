/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');
var fs = require('fs');
var config = require('../../config/config');

var File = mongoose.model('File');
var User = mongoose.model('User');

exports.download = function (req, res, next) {
	File.findById(req.params.fileId, function (err, file) {
		if (err) return next(err);

		res.download(config.root + '/files/' + file.name, file.originalname, function (err) {
			if (err) {
				winston.log(err);
				if (!res.headersSent) {
					return next(new Error('not found'));
				}
			}
		});
	});
};

exports.get = function (req,res) {
	res.render('file/new');
};

exports.upload = function (req, res, next) {
	var file = new File(req.files.file);

	file.save(function (err) {
		if (err) {
			fs.unlink(config.root + '/files/' + file.name);
			return next(err);
		}

		res.json(file);
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		File.findById(req.params.fileId, callback);
	}], function (err, results) {
		if (err) return next(err);

		res.render('file/edit', {file: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	File.findById(req.params.fileId, function (err, file) {
		if (err) return next(err);

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

exports.delete = function (req, res, next) {
	File.findByIdAndRemove(req.params.fileId)
		.exec(function (err, file) {
			if (err) return next(err);

			fs.unlink(file.name);
			res.json(200);
		});
};

