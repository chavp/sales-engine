var mongoose = require('mongoose');
// define our Lead model
var StatusTips = ['Enable', 'Disable']
var Schema = mongoose.Schema;


var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, '{PATH} cannot be empty']


var Tip = new Schema({
    Title: { type: String, required: 'Please Enter Title Of Tip', validate: RequiredEmptyValidator },
    Body: { type: String, required: 'Please Enter Body Of Tip', validate: RequiredEmptyValidator },
    CreatedDate: { type: Date, default: Date.now },
    Tags: [{ name: { type: String, required: 'Please Enter tags', validate: RequiredEmptyValidator } }],
    Status: { type: String, enum: StatusTips },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
});
module.exports = mongoose.model('Tip', Tip);