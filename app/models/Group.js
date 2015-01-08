
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * Group Schema
 */

var GroupSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	members: [{type: ObjectId, ref: 'User'}],
	roles: [{type: ObjectId, ref: 'Role'}]
});

/**
 * Setters
 */

GroupSchema.path('members').set(function (v) {
	console.log('set:',v);
	return v ? v.split(',') : undefined;
});

GroupSchema.path('roles').set(function (v) {
	return v === '' ? undefined : v;
});

/**
 * Virtuals
 */


/**
 * Validations
 */

GroupSchema.path('members').validate(function (v) {
	console.log('validate:',v);
	return true;
});

/**
 * Pre-save hook
 */


/**
 * Methods
 */

GroupSchema.methods = {};

/**
 * Statics
 */

GroupSchema.statics = {

	/**
	 * Load
	 *
	 * @param {Object} options
	 * @param {Function} cb
	 * @api private
	 */

	load: function (options, cb) {
		options.select = options.select || 'name';
		this.findOne(options.criteria)
			.select(options.select)
			.exec(cb);
	}
};

mongoose.model('Group', GroupSchema);
