var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

 var organizationSchema = new Schema({
	name:{
		type: String,
		require: true
	},

	members: [{
		type:Schema.ObjectId, 
		ref:"Member",
		childPath:"organizations"
	}],

	leads: [{
		type:Schema.ObjectId, 
		ref:"Lead"
	}]
});

organizationSchema.plugin(timestamps);

organizationSchema.plugin(relationship, { relationshipPathName: 'members' });

organizationSchema.statics.findByName = function (name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
}

organizationSchema.statics.findOneByName = function (name, cb) {
  return this.findOne({ name: new RegExp(name, 'i') }, cb);
}

mongoose.model('Organization', organizationSchema);