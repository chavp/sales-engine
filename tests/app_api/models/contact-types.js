var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

  var contactTypeSchema = new Schema({
  	_id:{
		type: String,
		require: true,
		unique: true
	},

 	name:{
		type: String
	}

 });

 mongoose.model('ContactType', contactTypeSchema);