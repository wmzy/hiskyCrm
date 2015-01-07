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
		type: {
			type: String, required: true,
			enum: ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array']
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

SchemaSchema
	.virtual('itemModel')
	.get(function () {
		try {
			console.log('e');
			return mongoose.model(this.name);
		} catch (e) {
			if (this.fields && this.fields.length) {
				return mongoose.model(this.name, new Schema(this.fields.reduce(function (pre, cur) {
					pre[cur.name] = global[cur.type] || Schema.Types[cur.type];
					return pre;
				}, {})), this.name);
			}

			throw e;
		}
	});

/**
 * Validations
 */

//SchemaSchema.path('members').validate(function (v) {
//	console.log('validate:',v);
//	return true;
//});

/**
 * Post hooks
 */

SchemaSchema.post('save', function (schema) {
	delete mongoose.models[schema.name];
	delete mongoose.modelSchemas[schema.name];

	if (schema.fields && schema.fields.length) {
		mongoose.model(schema.name, new Schema(schema.fields.reduce(function (pre, cur) {
			pre[cur.name] = global[cur.type] || Schema.Types[cur.type];
			return pre;
		}, {})), schema.name);
	}
});

SchemaSchema.post('remove', function (schema) {
	delete mongoose.models[schema.name];
	delete mongoose.modelSchemas[schema.name];
});

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

// todo: 当name改变时需要删除旧的model 和 依赖