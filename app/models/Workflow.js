
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * Node Schema
 */

var NodeSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	processors: {
		selector: String,
		strategy: {type: String, enum: ['preemption', 'cooperation'], default: 'preemption'}
	},
	waitNode: {
		all: [ObjectId],
		any: [ObjectId],
		quantity: Number
	},
	nextNode: [ObjectId],
	state: {type: String, enum: ['wait', 'on', 'done'], default: 'wait'},
	type: {type: String, enum: ['start', 'middle', 'end'], default: 'end'}
});

/**
 * Workflow Schema
 */

var WorkflowSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	nodes: [NodeSchema],
	allows: [{type: ObjectId, ref: 'User'}],
	deny: [{type: ObjectId, ref: 'Role'}]
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


/**
 * Pre-save hook
 */


/**
 * Methods
 */

WorkflowSchema.methods = {};

/**
 * Statics
 */

WorkflowSchema.statics = {

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

mongoose.model('Workflow', WorkflowSchema);

