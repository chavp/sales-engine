var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
	Schema = mongoose.Schema;
    relationship = require("mongoose-relationship");

var memberProfileSchema = new Schema({
	firstName:{
		type: String,
		require: true
	},
	lastName: {
		type: String,
		require: true
	},
	phone:{
		type: String,
		require: true
	},
	email:{
		type: String,
		require: true
	},

	member: {
		type: Schema.ObjectId,
		ref: 'Member',
		childPath:"profile"
	}
});

memberProfileSchema.plugin(timestamps);
memberProfileSchema.plugin(relationship, { relationshipPathName:'member' });

mongoose.model('MemberProfile', memberProfileSchema);