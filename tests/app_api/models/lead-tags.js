var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var leadTagSchema = new Schema({
	tag: {
		type: String
	},

	type:{
		type: String,
		enum: ['Email', 'Phone', 'Undefined'],
		default : 'Undefined'
	},

	lead: {
		type: Schema.ObjectId,
		ref: 'Lead',
		childPath:"tags" 
	}
 });


leadTagSchema.plugin(timestamps);
leadTagSchema.plugin(relationship, { relationshipPathName:'lead' });

mongoose.model('LeadTag', leadTagSchema);