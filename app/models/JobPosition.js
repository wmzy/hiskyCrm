
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * JobPosition Schema
 */

var JobPositionSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, default: ''},
    requirements: {type: String, default: ''},
    numberOfEmployees: { type: Number, default: 0 },
    createdBy: {
        user: {type: ObjectId, ref: 'Users'},
        date: {type: Date, default: Date.now}
    },
    editedBy: {
        user: {type: ObjectId, ref: 'Users'},
        date: {type: Date, default: Date.now}
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

JobPositionSchema.methods = {};

/**
 * Statics
 */

JobPositionSchema.statics = {

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

mongoose.model('JobPosition', JobPositionSchema);

