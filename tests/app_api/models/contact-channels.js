var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var contactChannelSchema = new Schema({
	name:{
		type: String
	},

	type:{
		type: String,
		enum: ['Office', 'Mobile', 'Home', 'Direct', 'Fax', 'URL', 'Other'],
		default : 'Office'
	},

	contact: {
		type: Schema.ObjectId,
		ref: 'Contact',
		childPath:"contactChannels" 
	}
});

contactChannelSchema.plugin(timestamps);
contactChannelSchema.plugin(relationship, { relationshipPathName:'contact' });

mongoose.model('ContactChannel', contactChannelSchema);