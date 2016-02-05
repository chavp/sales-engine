var mongoose = require('mongoose');
var StatusOrganization = ['Enabled', 'Disabled']
var SizeOrg = ['Just Me', '2-5', '6-10', '11-30', '30-99', 'We`re Huge(100+)'];
var currency = ['Dollar', 'Euro'];
var RepetitionType = ['One time', 'Monthly', 'Annual']
var Plan = ['Basic(65$/user/mo.)', 'Pro(110$/user/mo.)', 'Business(165$/user/mo.)', ' save 10% in Year(702$/user/year) ']
//var requiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)
//}, '{PATH} cannot be empty']

var schemaOptions = {
    toJSON: {
        virtuals: true
    }
};
var Schema = mongoose.Schema;

var Organization = new Schema({
    Title: { type: String, required: 'please enter Title Of organization' },
    Size: { type: String, required: 'please enter Size Of Organzation ', enum: SizeOrg },
    DefaultCurrency: { type: String, required: 'please enter Default Currency',  default: 'Dollar' },
    Status: { type: String, enum: StatusOrganization, default: 'Enabled' },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    UpdatedDate: { type: Date },
    Leads: [{ type: Schema.Types.ObjectId, ref: 'Lead' }],
    LeadStatus: [{
        Title: { type: String }
    }],
    OpprtunityStatus: [{
        Title: { type: String }
    }],
    Inbox: [{
        Type: { type: String },
        Lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
        LeadLabel: { type: String },
        CreatedDate: { type: String },
        Status: { type: String },
        User: { type: Schema.Types.ObjectId, ref: 'User' },
        UserLabel: { type: String },
        DueDate: { type: String },
        OriginalDate: { type: String },
        Attributes: {}
    }],
    SmartViews: [{
        Name: { type: String },
        Query: { type: String },
        CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        Shared: {}
    }],
    CustomFields: [{
        Name: { type: String },
        Query: { type: String },
        CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        Shared: {}
    }],
    Members: [{
        Name: { type: String },
        Email: { type: String },
        Status: { type: String },
        Plan: { type: String },
        Phone: { type: String },
        Role: { type: String }
    }]
}, schemaOptions);
Organization.virtual('UsersCount').get(function () {
    return this.Members.length;
});
module.exports = mongoose.model('Organization', Organization);