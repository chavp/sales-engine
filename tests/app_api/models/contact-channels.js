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

contactChannelSchema.pre('remove', function(next) {
    var me = this;
    next();
    /*ContactChannel.find(
    	{ name: me.name }, 
		function(err, contactChannels){
			if(contactChannels && contactChannels.length == 1)
			{
				LeadTag.find(
					{ tag: me.name}, 
	     			function(err, tags){
	     				if(tags && tags.length > 0)
	     				{
	     					tags[0].remove();
	     				}
	     			}
	     		);
			}
			next();
		}
	);*/
});


mongoose.model('ContactChannel', contactChannelSchema);