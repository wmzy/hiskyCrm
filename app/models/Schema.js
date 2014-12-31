/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * User Schema
 */

var SchemaSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	owner: {type: ObjectId, ref: 'User'},
	createdBy: {
		user: {type: ObjectId, ref: 'User'},
		date: {type: Date, default: Date.now}
	},
	editedBy: {
		user: {type: ObjectId, ref: 'User'},
		date: {type: Date}
	},
	fields: [{
		name: {type: String, required: true},
		type: {type: String, required: true,
			enum: ['String', 'Number', 'Date','Buffer', 'Boolean', 'Mixed', 'Objectid', 'Array']
		}
	}]
});

/**
 * Setters
 */

//SchemaSchema.path('roles').set(function (v) {
//	return v === '' ? undefined : v;
//});

/**
 * Virtuals
 */


/**
 * Validations
 */

//SchemaSchema.path('members').validate(function (v) {
//	console.log('validate:',v);
//	return true;
//});

/**
 * Pre-save hook
 */


/**
 * Methods
 */

SchemaSchema.methods = {};

/**
 * Statics
 */

SchemaSchema.statics = {

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

mongoose.model('Schema', SchemaSchema);

