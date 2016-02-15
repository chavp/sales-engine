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

leadSchema.pre('remove', function(next) {
	var lead = this;
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Contact.remove({ lead: lead }).exec();
    next();
});

leadSchema.plugin(timestamps);
leadSchema.plugin(relationship, { relationshipPathName:'organization' });
leadSchema.plugin(relationship, { relationshipPathName:'createdBy' });

//leadSchema.plugin(relationship, { relationshipPathName:'organization' });

mongoose.model('Lead', leadSchema);