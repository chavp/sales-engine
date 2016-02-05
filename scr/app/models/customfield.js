var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, 'value cannot be empty']


var CustomField = new Schema({
    Order: { type: Number },
    FieldName: { type: String, required: 'please enter field name', validate: RequiredEmptyValidator },
    TypeField: { type: String, required: 'please enter type of field', validate: RequiredEmptyValidator },
    Choices: [{}],
    CurrentValue: { type: String, required: 'please enter title', validate: RequiredEmptyValidator },
    CurrentTime: { type: String },
    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'please enter lead' },
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },

});
module.exports = mongoose.model('CustomField', CustomField);