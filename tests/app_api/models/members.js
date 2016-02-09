var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship");

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var memberSchema = new Schema({
	email:{
		type: String,
		require: true,
		unique: true
	},
	
	username:{
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

memberSchema.methods.validPassword = function(candidatePassword) {
	var member = this;
    return bcrypt.compareSync(candidatePassword, member.password); // true 
};

memberSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

memberSchema.statics.findOneByUsername = function (username, cb) {
  return this.findOne({ username: username }, cb);
}

/*memberSchema.virtual('profile').get(function () {
  console.log(this);
  return this;
});*/

memberSchema.plugin(timestamps);

mongoose.model('Member', memberSchema);