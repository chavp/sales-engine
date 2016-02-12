var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

  var questionSchema = new Schema({
  	_id: {
  		type: Number
  	},
   	sentence:{
  		type: String,
  		require: true
  	},
    choices:[{
        type: Number,
        ref: 'Choice'
      }]
 });

 mongoose.model('Question', questionSchema);