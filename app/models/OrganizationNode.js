var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var OrganizationNodeSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true, trim: true},
    type: {type: String, default: ''},
    parent: {type: ObjectId, ref: 'OrganizationNode'},
    children: [{type: ObjectId, ref: 'OrganizationNode'}],
    manager: {type: ObjectId, ref: 'Employees'},
    users: [{type: ObjectId, ref: 'Users'}],
    createdBy: {
        user: {type: ObjectId, ref: 'User'},
        date: {type: Date, default: Date.now}
    },
    editedBy: {
        user: {type: ObjectId, ref: 'User'},
        date: {type: Date}
    },
    nestingLevel: {type: Number, default: 0},
    sequence: {type: Number, default: 0}
});

OrganizationNodeSchema.methods = {};

OrganizationNodeSchema.statics = {
    list: function (options, cb) {
        var criteria = options.criteria || {};

        this.find(criteria)
            .sort({'createdAt': -1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },
    getById: function (id, cb) {
        this.findOne({_id: id})
            .populate('createdBy.user username')
            .populate('editedBy.user')
            .populate('organizationNodeManager')
            .exec(cb);
    }
};

mongoose.model('OrganizationNode', OrganizationNodeSchema);
