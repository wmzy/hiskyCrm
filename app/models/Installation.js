
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * Installation Schema
 */

var InstallationSchema = new Schema({
	// name: {type: String, required: true},
	No: {type: String, required: true},
	note: {type: String, default: ''},
	creator: {type: ObjectId, ref: 'User'},
	createdAt: {type : Date, default : Date.now},
	state: {type: String, enum: ['未开始', '开始', '完成'], default: '未开始'},
	customerName: {type: String},
	customerAddress: {type: String},
	task: {
		from: Date,
		to: Date
	},
	machineNo: {type: String, required: true},
	log: {
		files: [String]
	}
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

InstallationSchema.methods = {};

/**
 * Statics
 */

InstallationSchema.statics = {

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

mongoose.model('Installation', InstallationSchema);

