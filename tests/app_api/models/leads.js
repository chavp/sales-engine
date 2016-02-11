var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

 var leadSchema = new Schema({
 	organization: {
		type: Schema.ObjectId,
		ref: 'Organization',
		childPath:"leads" 
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'Member',
		childPath:"leads" 
	},
 	organizationName:{
		type: String
	},
	description:{
		type: String
	},
	url:{
		type: String
	}
 });

leadSchema.plugin(timestamps);

leadSchema.plugin(relationship, { relationshipPathName:'organization' });

//leadSchema.plugin(relationship, { relationshipPathName:'organization' });

mongoose.model('Lead', leadSchema);