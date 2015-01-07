/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var winston = require('winston');
var async = require('async');

var Schema = mongoose.model('Schema');
var Item = mongoose.model('Item');
var User = mongoose.model('User');

exports.index = function (req, res, next) {
	Item.find(function (err, item) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('item/index', {items: item});
	});
};

exports.new = function (req,res, next) {
	Schema.find(function (err, schemas) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		res.render('item/new', {schemas: schemas});
	});
};
exports.newForm = function (req,res, next) {
	Schema.findById(req.params.schemaId, function (err, schema) {
		if (err) {
			winston.error(err);
			return next(err);
		}
		console.log(schema);
		res.render('item/newForm', schema);
	});
};

exports.create = function (req, res) {
	async.waterfall([function(callback){
		Schema.findById(req.params.schemaId, callback);
	}, function (schema, callback) {
		var Item = schema.itemModel;
		var item = new Item(req.body);
		item.save(callback);
	}], function (err, result) {
		if (err) {
			winston.error(err);
			req.flash('err', err);
		}
		winston.info('1');

		req.flash('success', 'Successfully created ' + results);
		res.redirect('/item');
	});
};

exports.edit = function (req, res, next) {
	async.parallel([function (callback) {
		User.find(callback);
	}, function (callback) {
		Item.findById(req.params.itemId, callback);
	}], function (err, results) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		res.render('item/edit', {item: results[1], users: results[0]});
	});
};

exports.update = function (req, res, next) {
	Item.findById(req.params.itemId, function (err, item) {
		if (err) {
			winston.error(err);
			return next(err);
		}

		item = extend(item, req.body);
		item.save(function (err) {
			if (err) {
				winston.error(err);
				req.flash('err', err);
			}

			res.redirect('/item');
		});
	});
};

exports.delete = function (req, res) {
	Item.findByIdAndRemove(req.params.itemId)
		.exec(function (err) {
			if (err) {
				winston.error(err);
				return res.json(422, err);
			}

			res.json(200);
		});
};

