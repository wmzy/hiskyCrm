/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var OrganizationNode = mongoose.model('OrganizationNode');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

exports.index = function (req, res, next) {
	OrganizationNode.find(function (err, data) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('organization/index', {nodes: data});
	});
};

exports.create = function (req, res) {
	var org = new OrganizationNode();
	org.name = req.body.name;
	org.type = req.body.type;
	org.parent = req.body.parent || undefined;
	org.children = req.body.children;

	async.series([function (callback) {
		org.save(function (err) {
			callback(err);
		});
	}, function (callback) {
		if (org.parent) {
			return OrganizationNode.findByIdAndUpdate(org.parent, {$push: {children: org._id}}, callback);
		}

		callback();
	}], function (err) {
		if (err) {
			winston.error(err);
			return req.flash('err', err);
		}

		res.json({node: org});
	});
};

exports.update = function (req, res) {
	OrganizationNode.findById(req.params.orgId, function (err, org) {
		if (err)
			res.flash('err', err);

		if (org.parent && org.parent !== req.body.parent) {
			return req.flash('err', '父节点出错');
		}
		org.name = req.body.name;
		org.type = req.body.type;
		org.manager = req.body.manager || undefined;

		org.save(function (err) {
			if (err) {
				req.flash('err', err);
				return res.json(err);
			}

			res.json(org);
		});
	});
};

exports.move = function (req, res) {
	async.waterfall([function (callback) {
		OrganizationNode.findById(req.param.orgId, 'parent', function (err, org) {
			if (err) {
				callback(err);
			}
			if (org.parent) {
				callback(null, org);
			}
			callback(new Error('不能移动根结点'));
		});
	}, function (org, callback) {
		OrganizationNode.findByIdAndUpdate(req.param.parent, {$push: {children: org._id}}, function (err) {
			callback(err, org);
		});
	}, function (org, callback) {
		OrganizationNode.findByIdAndUpdate(org.parent, {$pull: {children: org._id}}, function (err) {
			callback(err, org);
		});
	}, function (org, callback) {
		org.parent = req.param.parent;
		org.save(callback);
	}], function (err) {
		if (err) {
			winston.error(err);
			return req.flash('err', err);
		}

		res.send(200);
	});
};

exports.delete = function (req, res) {
	OrganizationNode.findById(req.params.orgId)
		.exec(function (err, org) {
			console.log(org);
			var tasks = [];
			if (org.parent) {
				tasks.push(function (callback) {
					OrganizationNode.findByIdAndUpdate(org.parent, {$pull: {children: org._id}})
						.exec(function (err) {
							callback(err);
						});
				});
			}
			tasks.push(function (callback) {
				org.remove(function (err) {
					if (err) {
						callback(err);
					}
					res.json({message: 'org removed!'});
				});
			});
			async.series(tasks, function (err) {
				req.flash('err', err);
			});
		});
};
