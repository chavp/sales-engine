var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

 var leadSchema = new Schema({
 	companyName:{
		type: String,
		require: true
	},

	contacts: [{
		type:Schema.ObjectId, 
		ref:"Contact"
	}],

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
	description:{
		type: String
	},
	url:{
		type: String
	}
 });

leadSchema.plugin(timestamps);
leadSchema.plugin(relationship, { relationshipPathName:'organization' });
leadSchema.plugin(relationship, { relationshipPathName:'createdBy' });

//leadSchema.plugin(relationship, { relationshipPathName:'organization' });

mongoose.model('Lead', leadSchema);