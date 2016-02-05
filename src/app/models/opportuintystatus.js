var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var typeOpportunityStatus = ['Active','Won','Lost']

//var RequiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)

//}, '{PATH} cannot be empty']


var OpportunityStatus = new Schema({
    Label: { type: String, required: 'please enter title Of opportunity status'},
    LabelLower: { type: String, lowercase: true },
    Type: { type: String, enum: typeOpportunityStatus, required: 'please enter type'},
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization' ,required: 'please enter organization '}

});
module.exports = mongoose.model('OpportunityStatus', OpportunityStatus);