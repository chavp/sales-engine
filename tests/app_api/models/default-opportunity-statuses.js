var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

  var defaultOpportunityStatusSchema = new Schema({
  	_id: {
  		type: Number
  	},
 	name:{
		type: String,
		require: true,
		unique: true
	},
	order:{
		type: Number
	}
 });

 mongoose.model('DefaultOpportunityStatus', defaultOpportunityStatusSchema);