var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

  var choiceSchema = new Schema({
  	_id: {
  		type: Number
  	},
 	result:{
		type: String,
		require: true
	}
 });

 mongoose.model('Choice', choiceSchema);