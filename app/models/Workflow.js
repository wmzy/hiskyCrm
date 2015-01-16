
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
	testStart: String,// 上一节点完成时，检查是否开始本节点
	processors: {
		selector: String,
		strategy: {type: String, enum: ['preemption', 'cooperation'], default: 'preemption'}
	},
	form: {
		schemaOf: {type: ObjectId, ref: 'Schema'},
		viewId: ObjectId
	},
	waitNodes: [ObjectId],
	nextNodes: [{
		id: ObjectId,
		isOptional: Boolean,
		test: String
	}],
	type: {type: String, enum: ['start', 'middle', 'end'], default: 'end'}
});

/**
 * Workflow Schema
 */

var WorkflowSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	owner: {type: ObjectId, ref: 'User'},
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

