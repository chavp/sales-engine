
var mongoose = require('mongoose');
// define our Lead model
var Schema = mongoose.Schema;


//var RequiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)
//}, '{PATH} cannot be empty']

var EmailTemplate = new Schema({
    Name: { type: String, required: 'please enter name of email template'},
    Subject: { type: String, required: 'please enter subject of mail'},
    Body: { type: String, required: 'please enter body of mail' },
    Shared: { type: Boolean, default: false }, // for be shared or not
    AttachmentUrl: [{ type: String }],
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'please enter user'},
    CreatedDate: { type: Date, default: Date.now },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    UpdatedDate: { type: Date },
    Organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization' }
});
module.exports = mongoose.model('EmailTemplate', EmailTemplate);