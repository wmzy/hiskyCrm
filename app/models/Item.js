
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * User Schema
 */

var ItemSchema = new Schema({
	title: {type: String, required: true},
	creator: {type: ObjectId, ref: 'User'},
	createdAt  : {type : Date, default : Date.now},
	useSchema: {type: ObjectId, ref: 'Schema'},
	history: [{
		nodeId: ObjectId,
		state: {type: String, enum: ['wait', 'on', 'done', 'invalid'], default: 'wait'},
		processors: [{type: ObjectId, ref: 'User'}]
	}],
	currentNodes: [ObjectId],
	state: {type: String, enum: ['new', 'on', 'done', 'delete', 'lock'], default: 'new'},
	log: [String],
	workflow: {type: ObjectId, ref: 'Workflow'}
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

ItemSchema.methods = {};

/**
 * Statics
 */

ItemSchema.statics = {

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

mongoose.model('Item', ItemSchema);

