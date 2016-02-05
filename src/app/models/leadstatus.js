var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//var RequiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)

//}, '{PATH} cannot be empty']


var StatusLead = new Schema({
    Label: { type: String, required: 'please enter title of lead status' },
    LabelLower: { type: String, lowercase: true },
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization'}

});
module.exports = mongoose.model('StatusLead', StatusLead);