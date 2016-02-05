var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)
}, '{PATH} cannot be empty']

var RegexUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var RegexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


var Contact = new Schema({
    Order: { type: Number },
    Name: { type: String, required: 'Please Enter Contact Name' },
    ContactTitle: { type: String, required: 'Please enter contact title' },
    Phones: [
        {
            Phone: { type: String, required: 'Please enter Phone' },
            PhoneFormatted: { type: String, required: 'Please Enter Phone Formatted' },
            Type: { type: String, required: 'Please enter Type Of Phone' }
        }
    ],
    Emails: [
        {
            Type: { type: String, required: 'Please enter Type Of Email' },
            EmailLower: { type: String, lowercase: true, required: 'Please enter Email' },
            Email: { type: String, required: 'Please enter E-mail', match: [RegexEmail, 'Please Enter Correct E-mail'] }
        }
    ],
    Urls: [
        {
            Url: { type: String, match: [RegexUrl, 'Please Enter Correct Url'], required: 'Please enter Url' }
        }
    ],
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please enter user' },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    UpdatedDate: { type: Date },
    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'Please enter lead' },
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please enter organization' }
});
module.exports = mongoose.model('Contact', Contact);