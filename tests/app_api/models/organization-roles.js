var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var organizationRoleSchema = new Schema({
	member: {
		type: Schema.ObjectId,
		ref: 'Member',
		require: true
	},
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization',
		require: true
	},
	role: {
		type: String, 
		enum: ['Admin', 'User'],
        default : 'Admin'
	}
});

organizationRoleSchema.plugin(timestamps);

//organizationRoleSchema.plugin(relationship, { relationshipPathName: 'member' });
//organizationRoleSchema.plugin(relationship, { relationshipPathName: 'organization' });

mongoose.model('OrganizationRole', organizationRoleSchema);