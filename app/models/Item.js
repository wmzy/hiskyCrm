
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
		processors: [{type: ObjectId, ref: 'User'}]
	}],
	currentNodes: [{
		nodeId: ObjectId,
		processors: [{type: ObjectId, ref: 'User'}]
	}],
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

