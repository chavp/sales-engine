var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TaskStatus = ['Complete', 'InComplete'];
var AddressType = ['Mailing', 'Business', 'Other'];
var CustomFieldOptions = ['Choices', 'Date', 'DateTime', 'Number', 'text', 'Hidden Field(for Api Only)'];
var RepetitionType = ['OneTime', 'Monthly', 'Annual']
var RegexUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var RegexUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var RegexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)

}, 'value cannot be empty']



var Lead = new Schema({
    Title: { type: String, required: 'please enter title' },
    Description: { type: String },
    Url: { type: String, default :'', match: [RegexUrl, 'Please Write Correct Url'] },
    CurrentStatus: { type: Schema.Types.ObjectId, ref: 'Organization.LeadStatus' },
    StatusLabel: { type: String, default: '' },
    CreatedDate: { type: Date, default: Date.now },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please enter user' },
    UpdateDate: { type: Date },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    Orgnization: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization' },
    Tasks: [{
        CreateDate: { type: Date, default: Date.now },
        CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        Title: { type: String, required: 'Please Enter Comment Task', trim: [true, 'Please Enter Comment Task'] },
        AssignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: 'please select one assign to', trim: [true, 'please select one assign to'] },
        AssignedToLabel: { type: String },
        DueDate: { type: String, default: Date.now },
        Time: { type: String, default: Date.now },
        TaskCompleted: { type: Boolean, default: false },
        OriginalDate: { type: Date, default: Date.now }
    }],
    HtmlUrl: { type: String },
    Addresses: [{
        Type: { type: String, enum: AddressType, required: 'Please Enter Type Of Address', trim: [true, 'Please Enter Type Of Address'] },
        Country: { type: String, required: 'Please Enter Country', trim: [true, 'Please Enter Country'] },
        State: { type: String, required: 'Please Enter State', trim: [true, 'Please Enter State'] },
        City: { type: String, required: 'Please Enter City', trim: [true, 'Please Enter City'] },
        Address: { type: String, required: 'Please Enter Address', trim: [true, 'Please Enter Address'] },
        ContinueAddress: { type: String, required: 'Please Enter ContinueAddress', trim: [true, 'Please Enter ContinueAddress'] },
        PostalCode: { type: Number, required: 'Please Enter PostalCode', trim: [true, 'Please Enter PostalCode'] },
        GEOID: { type: String }
    }],
    ImportFrom: { type: String },
    Contacts: [{
        Name: { type: String, required: 'Please Enter Contact Name' },
        ContactTitle: { type: String },
        Details:
            [{
                Value: { type: String },
                Type: { type: String }
            }],
        CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please enter contact created by user' },
        CreatedDate: { type: Date, default: Date.now },
        UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        UpdatedDate: { type: Date }
    }],
    Opportunities: [{
        Value: { type: String, required: 'Please Enter Value  of Opportunity', trim: [true, 'Please Enter Value  of Opportunity'] },
        Currancy: { type: String, required: 'Please Enter Value Currency', trim: [true, 'Please Enter Value   Currency'] },
        Confidence: { type: Number, required: 'Please Enter Confidence', trim: [true, 'Please Enter Value  of Confidence'], min: 0, max: 100 },
        Note: { type: String },
        LeadLabel: { type: String, default: 'Legacy data' },
        LeadId: { type: String, default: '0' },
        DateOpen: { type: String, default: Date.now },
        DateClosed: { type: String },
        EstimateDate: { type: Date, default: Date.now },
        CreatedDate: { type: String, default: Date.now },
        CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        CurrentStatus: { type: Schema.Types.ObjectId, ref: 'Organization.OpprtunityStatus' },
        StatusLabel: { type: String, default: '' },
        AssignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        AssignedToLabel: { type: String, default: '' },
        UpdatedDate: { type: Date },
        UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        Contact: { type: Schema.Types.ObjectId, ref: 'Lead.Contact' },
        ContactLabel: { type: String },
        Repetion: { type: String, enum: RepetitionType },
    }],
    CustomFeilds: [{
        Name: { type: String, required: 'Please Enter Contact Name' },
        Type: { type: String, enum: CustomFieldOptions },
        Values: { type: String },
        CurrentValue: {},
        CurrentTime: {}
    }],
    Activities: [{
        Date: { type: String, required: 'Please Enter Activity Date', default: Date.now },
        Type: { type: String, required: 'What is activity type' },
        TimeAgo: { type: String, default: 'Not yet' },
        Due: { type: String, default: Date.now },
        Status: { type: String, default: 'Active' },
        AssignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        AssignedToLabel: { type: String, default: 'Not Assigned Yet' },
        Attributes: {}
    }],
    StatusHistory: [{
        Date: { type: String, required: 'Please Enter Activity Date', default: Date() },
        From: { type: String, required: 'What is activity type' },
        To: { type: String, required: 'What is activity type' },
        By: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
});
module.exports = mongoose.model('Lead', Lead);
