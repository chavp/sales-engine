var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, '{PATH} cannot be empty']


var SmartViews = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: 'User', required: 'please enter user' },
    Shared: { type: Boolean, default: false },
    UsedRecently: { type: Boolean, default: false },
    Organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization' },
    Query: { type: String, required: 'please enter query', validate: RequiredEmptyValidator },
    Name: { type: String, required: 'please enter name of smart view ', validate: RequiredEmptyValidator }
});
module.exports = mongoose.model('SmartViews', SmartViews);
