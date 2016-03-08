var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
	Schema = mongoose.Schema;
    relationship = require("mongoose-relationship");

var mailgunForwardSchema = new Schema({
	body:{
		type: String
	},

	params:{
		type: String
	}
});

mailgunForwardSchema.plugin(timestamps);

mongoose.model('MailgunForward', mailgunForwardSchema);