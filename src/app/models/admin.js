var mongoose = require('mongoose');

var StatusAdmin = ['Enable', 'Disable'];

var Schema = mongoose.Schema;


var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)
}, '{PATH} cannot be empty']


var Admin = new Schema({
    Email: { type: String, required: 'Please Your Email', validate: RequiredEmptyValidator },
    Password: { type: String, required: 'Please Enter Your Password', validate: RequiredEmptyValidator },
    Status: { type: String, enum: StatusAdmin },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
});
module.exports = mongoose.model('Admin', Admin);