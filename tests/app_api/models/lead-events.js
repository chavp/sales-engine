var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var leadEventSchema = new Schema({
 	title: {
		type: String
	},

	content: {
		type: String
	},

	type:{
		type: String,
		enum: ['Note', 'Email', 'Call', 'Lead', 'Task', 'Undefined'],
		default : 'Undefined'
	},

	riaseFrom: {
		type: Schema.ObjectId,
		ref: 'Member'
	},

	riaseTo: {
		type: Schema.ObjectId,
		ref: 'Member'
	},

	lead: {
		type: Schema.ObjectId,
		ref: 'Lead',
		childPath:"events" 
	},

	compose: {
		type: Schema.ObjectId,
		ref: 'Compose'
	}
 });


leadEventSchema.plugin(timestamps);
leadEventSchema.plugin(relationship, { relationshipPathName:'lead' });

mongoose.model('LeadEvent', leadEventSchema);