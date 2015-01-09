
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Role Schema
 */

var RoleSchema = new Schema({
	name: {type: String, required: true, unique: true, trim: true},
	description: {type: String, default: ''}
});

/**
 * Setters
 */


/**
 * Virtuals
 */


/**
 * Validations
 */

RoleSchema.path('name').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

/**
 * Pre-save hook
 */


/**
 * Methods
 */

RoleSchema.methods = {};

/**
 * Statics
 */

RoleSchema.statics = {

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

mongoose.model('Role', RoleSchema);

