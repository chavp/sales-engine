var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

 var attachFileSchema = new Schema({
	compose: {
		type: Schema.ObjectId,
		ref: 'Compose',
		childPath:"attachs" 
	},

	fileName:{
		type: String
	},

	md5:{
		type: String
	},

    pathId:{
		type: String
	},

 	fileSize:{
		type: Number
	}
});

attachFileSchema.plugin(timestamps);
attachFileSchema.plugin(relationship, { relationshipPathName:'compose' });

mongoose.model('AttachFile', attachFileSchema);