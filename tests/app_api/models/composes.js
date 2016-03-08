var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var composeSchema = new Schema({
	lead: {
		type: Schema.ObjectId,
		ref: 'Lead'
	},

	createdBy:{
		type: Schema.ObjectId,
		ref: 'Member'
	},

    from:{
		type: String
	},

 	to:[{
		type: String
	}],

	cc:[{
		type: String
	}],

	bcc:[{
		type: String
	}],

	subject: {
		type: String
	},

	messageId:{
		type: String
	},

	replyTo:{
		type: String
	},

	content:{
		type: String
	},

	textBody:{
		type: String
	},

	htmlBody:{
		type: String
	},

	attachs:[{
		type:Schema.ObjectId, 
		ref:"AttachFile"
	}],

	sourceId:{
		type: Schema.ObjectId,
		ref: 'MailgunForward'
	},

	status: {
		type: String, 
		enum: ['Draft', 'Send', 'Read'],
        default : 'Draft'
	}
});

composeSchema.pre('save', function(next) {
    var me = this;
    //console.log(me.createdAt);
    if(me.createdAt == undefined){
	   LeadEvent.create({
		    	title: "Created email",
		    	riaseFrom: me.createdBy,
		    	lead: me.lead,
		    	type: 'Email',
		    	compose: me
		    }, function(err){
		    	if(err) next(err);
		    	next();
			});
	} else {
		next();
	}
});

composeSchema.pre('remove', function(next) {
	var me = this;
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    LeadEvent.remove({ compose: me }).exec();
    AttachFile.remove({ compose: me }).exec();

    next();
});


composeSchema.plugin(timestamps);

mongoose.model('Compose', composeSchema);