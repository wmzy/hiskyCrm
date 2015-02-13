
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
	machineNo: {type: String},
	log: {
		fs1_f1: {type: String, default: ''},
		fs1_f2: {type: String, default: ''},
		fs1_f3: {type: String, default: ''},
		fs1_f4: {type: String, default: ''},
		fs1_f5: {type: String, default: ''},
		fs1_f6: {type: String, default: ''},
		fs1_f7: {type: String, default: ''},
		fs1_f8: {type: String, default: ''},
		fs1_f9: {type: String, default: ''},
		fs1_f10: {type: String, default: ''},
		fs1_f11: {type: String, default: ''},
		fs1_f12: {type: String, default: ''},
		fs1_f13: {type: String, default: ''},
		fs1_f14: {type: String, default: ''},
		fs1_f15: {type: String, default: ''},

		fs2_f1_1: {type: String, default: ''},
		fs2_f1_2: {type: String, default: ''},
		fs2_f1_3: {type: String, default: ''},
		fs2_f1_4: {type: String, default: ''},
		fs2_f1_5: {type: String, default: ''},
		fs2_f2_1: {type: String, default: ''},
		fs2_f2_2: {type: String, default: ''},
		fs2_f2_3: {type: String, default: ''},
		fs2_f2_4: {type: String, default: ''},
		fs2_f2_5: {type: String, default: ''},
		fs2_f2_6: {type: String, default: ''},
		fs2_f2_7: {type: String, default: ''},
		fs2_f2_8: {type: String, default: ''},
		fs2_f2_9: {type: String, default: ''},
		fs2_f2_10: {type: String, default: ''},
		fs2_f2_11: {type: String, default: ''},
		fs2_f2_12: {type: String, default: ''},
		fs2_f2_13: {type: String, default: ''},
		fs2_f2_14: {type: String, default: ''},
		fs2_f2_15: {type: String, default: ''},
		fs2_f2_16: {type: String, default: ''},
		fs2_f2_17: {type: String, default: ''},
		fs2_f3: {type: String, default: ''},
		fs3_f1: {type: String, default: ''},
		fs3_f2: {type: String, default: ''},
		fs3_f3: {type: String, default: ''},
		fs3_f4: {type: String, default: ''},
		attachments: [{type: ObjectId, ref: 'File'}]
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

