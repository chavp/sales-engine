var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var contactSchema = new Schema({
 	name:{
		type: String
	},

	title:{
		type: String
	},

	lead: {
		type: Schema.ObjectId,
		ref: 'Lead',
		childPath:"contacts" 
	},

	contactChannels: [{
		type: Schema.ObjectId,
		ref: 'ContactChannel'
	}]
});

contactSchema.pre('remove', function(next) {
	//console.log('contact.remove');
    var contact = this;
    //console.log(contact._id);
    ContactChannel.remove({ contact: contact }).exec();
    next();
});

contactSchema.plugin(timestamps);
contactSchema.plugin(relationship, { relationshipPathName:'lead' });

 mongoose.model('Contact', contactSchema);