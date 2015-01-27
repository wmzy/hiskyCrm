
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
	_id: {type:String, required: true, unique: true},
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
	waitNodes: [String],
	nextNodes: [{
		id: String,
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
	version: String
});

/**
 * Setters
 */

//NodeSchema.path('form.schemaOf').set(function (v) {
//	return v || undefined;
//});

/**
 * Virtuals
 */


/**
 * Validations
 */

NodeSchema.path('form.schemaOf').validate(function (v) {
	console.log('v');
	console.log(v);
	return true;
});

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

