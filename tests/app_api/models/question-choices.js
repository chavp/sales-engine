var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

  var questionChoiceSchema = new Schema({
  	_id: {
  		type: Number
  	},
   	question:{
  		type: Schema.ObjectId,
  		ref: 'Question'
  	},
    choice:{
      type: Schema.ObjectId,
      ref: 'Choice'
    }
 });

questionChoiceSchema.plugin(timestamps);

mongoose.model('QuestionChoice', questionChoiceSchema);