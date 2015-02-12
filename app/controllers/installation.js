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

exports.newLog = function (req, res) {
	res.render('installation/newLog', {_id: req.params.installationId});
};

exports.viewLog = function (req, res, next) {
	Installation.findById(req.params.installationId, function (err, installation) {
		if (err) {
			return next(err);
		}
		if (!installation.log) {
			return next(new Error('not found'));
		}

		res.render('installation/viewLog', installation.log);
	});
};

exports.addLog = function (req, res, next) {
	Installation.findById(req.params.installationId, function (err, installation) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		installation.log = extend(installation.log, req.body);
		installation.state = '完成';
		installation.task.to = new Date();
		installation.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/machine/installation/task');
		});
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

exports.startTask = function (req, res, next) {
	async.waterfall([function (callback) {
		Installation.findById(req.params.taskId, callback);
	}, function (installation, callback) {
		if (installation.state !== '未开始') {
			return callback(new Error('任务已经开始！'));
		}
		installation.state = '开始';
		installation.task.from = new Date();
		installation.save(callback);
	}], function (err, installation) {
		if (err) {
			return next(err);
		}

		res.json(installation);
	});
};

exports.deleteTask = function (req, res, next) {
	async.waterfall([function (callback) {
		Installation.findById(req.params.taskId, callback);
	}, function (installation, callback) {
		if (installation.state !== '未开始') {
			return callback(new Error('只能删除未开始任务！'));
		}
		installation.remove(callback);
	}], function (err) {
		if (err) {
			return next(err);
		}

		res.json(200);
	});
};

exports.delete = function (req, res, next) {
	Installation.findByIdAndRemove(req.params.installationId)
		.exec(function (err) {
			if (err) {
				return next(err);
			}

			res.json(200);
		});
};

