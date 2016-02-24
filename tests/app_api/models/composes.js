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

	content:{
		type: String
	},

	attachs:[{
		type: String
	}],

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

composeSchema.plugin(timestamps);

mongoose.model('Compose', composeSchema);