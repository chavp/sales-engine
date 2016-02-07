var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var memberSchema = new Schema({
	userName:{
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true
	},

	profile: {
		type: Schema.ObjectId,
		ref: 'MemberProfile'
	},

	organizations:[{
		type: Schema.ObjectId,
		ref: 'Organization'
	}]
});

memberSchema.pre('save', function(next) {
    var member = this;

    // only hash the password if it has been modified (or is new)
    if (!member.isModified('password')) return next();
    
    member.password = bcrypt.hashSync(member.password, salt);
    next();
});

memberSchema.methods.login = function(candidatePassword) {
	var member = this;
    return bcrypt.compareSync(candidatePassword, member.password); // true 
};

memberSchema.statics.findOneByUserName = function (userName, cb) {
  return this.findOne({ userName: userName }, cb);
}

/*memberSchema.virtual('profile').get(function () {
  console.log(this);
  return this;
});*/

memberSchema.plugin(timestamps);

mongoose.model('Member', memberSchema);