/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * Field Schema
 */

var FieldSchema = new Schema({
	name: {type: String, required: true},
	type: {
		type: String,
		required: true,
		enum: ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array']
	}
});

/**
 * Forms Schema
 */

var FormSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: ''},
	type: {
		type: String,
		required: true,
		enum: ['new', 'modify', 'delete']
	},
	layout: String,
	fields: [{
		fieldId: ObjectId,
		operation: { type: String, default: 'read', enum: ['read', 'write'] }
	}]
});

/**
 * Schema Schema
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
	fields: [FieldSchema],
	forms: [FormSchema]
});

/**
 * Setters
 */

// todo: 当name改变或删除时需要删除旧的 model 依赖: 遍历model 的 ref
SchemaSchema.path('name').set(function (v) {
	this.oldName = v;
	return v;
});

/**
 * Virtuals
 */

SchemaSchema
	.virtual('itemModel')
	.get(function () {
		try {
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
 * Pre hooks
 */

SchemaSchema.pre('save', function (next) {
	var oldName = this.oldName || this.name;
	delete mongoose.models[oldName];
	delete mongoose.modelSchemas[oldName];

	if (this.fields && this.fields.length) {
		mongoose.model(this.name, new Schema(this.fields.reduce(function (pre, cur) {
			pre[cur.name] = global[cur.type] || Schema.Types[cur.type];
			return pre;
		}, {})), this.name);
	}
	next();
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

