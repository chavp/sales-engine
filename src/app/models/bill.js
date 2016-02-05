var mongoose = require('mongoose');

var Plan = ['Basic(65$/user/mo.)', 'Pro(110$/user/mo.)', 'Business(165$/user/mo.)', ' save 10% in Year(702$/user/year) ']
var Schema = mongoose.Schema;

var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, '{PATH} cannot be empty']


var Bill = new Schema({
    Date: { type: Date, default: Date.now },
    Total: { Type: Number, min: 0 },
    Status: { type: Boolean }, /*if cash or not */
    Details: {
        CurrentPlan: { type: String, enum: Plan },
        Quantity: { type: Number },
        Amount: { Type: Number }
    }

});
module.exports = mongoose.model('Bill', Bill);