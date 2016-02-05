/**
 * Created by Dragon on 05/10/2015.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var type =['Note','Email','Calls','ChangeLeadStatus','ChangeOpporuintyStatus','Tasks'];

//var RequiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)

//}, '{PATH} cannot be empty']


var Activity = new Schema({
    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' },
    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'Please select type' },
    Type: { type: String,enum:type, required: 'Please select organization'},
    value: { type: String, required: 'Please enter Value' },

    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select user' },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedDate: { type: Date, default: Date.now },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    customfields:[]


    //Notes: [{
    //    Type: { type: String, default: 'note' },
    //    Note: { type: String, required: 'Please enter Value Of Note' },
    //    LeadId: { type: Schema.Types.Object, ref: 'Lead', required: 'Please select lead' },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select user' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    UpdatedDate: { type: Date, default: Date.now },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' }
    //}],
    //Emails: [{
    //    Type: { type: String, default: 'emails' },
    //    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' },
    //    LeadId: { type: Schema.Types.Object, ref: 'Lead', required: 'Please select lead' },
    //    ContactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    UpdatedDate: { type: Date, default: Date.now },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //    Direction: { type: String, enum: direction, required: 'Please select Direction' },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select user' },
    //    Sender: { type: String },
    //    To: [{ type: String }],
    //    Cc: [{ type: String }],
    //    Bcc: [{ type: String }],
    //    Subject: { type: String },
    //    Envelope: {
    //        From: [
    //            {
    //                Email: { type: String },
    //                Name: { type: String }
    //            }
    //        ],
    //        Sender: [
    //            {
    //                Email: { type: String },
    //                name: { type: String }
    //            }
    //        ],
    //        To: [
    //            {
    //                Email: { type: String },
    //                Name: { type: String }
    //            }
    //        ],
    //        ReplyTo: [{ type: String }],
    //        Date: { type: Date },
    //        InReplyTo: { type: String },
    //        MessageId: { type: String },
    //        Subject: { type: String }
    //    },
    //    BodyText: { type: String },
    //    BodyHtml: { type: String },
    //    BodyTextQuoted: [
    //        {
    //            text: { type: String },
    //            expand: { type: Boolean }
    //        }
    //    ],
    //    Attachments: [
    //        {
    //            Url: { type: String },
    //            FileName: { type: String },
    //            Size: { type: Number },
    //            ContentType: { type: String }
    //        }
    //    ],
    //    Status: { type: String },
    //    Opens: [],
    //    Template_id: { type: Schema.Types.ObjectId, ref: 'EmailTemplate' },
    //    SendAttempts: []
    //}],
    //Calls: [{
    //    type: { type: String, default: 'Call' },
    //    LeadId: { type: Schema.Types.Object, ref: 'Lead', required: 'Please select lead ' },
    //    ContactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: 'Please select contact ' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select User ' },
    //    UpdatedDate: { type: Date, default: Date.now },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //    UserName: { type: String },
    //    Direction: { type: String, enum: calldirection, required: 'Please select direction ' },
    //    Status: { type: String, enum: callstatus, default: 'compeleted' },
    //    Note: { type: String },
    //    Duration: { type: Number, min: 0 },
    //    Phone: { type: String },
    //    Source: { type: String },
    //    RemotePhone: { type: String },
    //    VoiceEmailUrl: { type: String },
    //    RecordingUrl: { type: String }
    //}],
    //ChangeStatusLeads: [{
    //    Type: { type: String, defaultL: 'Change Status Lead' },
    //    OldStatusId: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: 'Please select lead status ' },
    //    OldStatusName: { type: String, required: 'Please select lead status ' },
    //    NewStatusId: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: 'Please select lead status ' },
    //    NewStatusName: { type: String, required: 'Please select lead status ' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select User ' },
    //    CreatedByName: { type: String },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //    UpdatedByName: { type: String },
    //    UserName: { type: String },
    //    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'Please select lead ' },
    //    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' }
    //}],
    //ChangeStatusOpportunity: [{
    //    Type: { type: String },
    //    OldStatusId: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: 'Please select opportunity status ' },
    //    OldStatusName: { type: String, required: 'Please select opportunity status ' },
    //    OldStatusType: { type: String, required: 'Please select opportunity status type ' },
    //    NewStatusId: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: 'Please select opportunity status ' },
    //    NewStatusType: { type: String, required: 'Please select opportunity status type ' },
    //    NewStatusName: { type: String, required: 'Please select opportunity status ' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select user' },
    //    CreatedByName: { type: String },
    //    UpdatedDate: { type: Date },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //    UpdatedByName: { type: String },
    //    UserName: { type: String },
    //    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'Please select lead ' },
    //    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' },
    //    OpportunityDateWon: { type: Date },
    //    OpportunityValue: { type: Number, required: 'Please select opportunity value ' },
    //    OpportunityValueFormatted: { type: String },
    //    OpportunityValueCurrency: { type: String }
    //}],
    //Tasks: [{
    //    Type: { type: String, default: 'task compelete' },
    //    TaskText: { type: String, required: 'Please enter task text ' },
    //    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'Please select user ' },
    //    CreatedByName: { type: String },
    //    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User', },
    //    UpdatedByName: { type: String },
    //    OrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'Please select organization' },
    //    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'Please select lead ' },
    //    CreatedDate: { type: Date, default: Date.now },
    //    UpdatedDate: { type: Date }
    //}]

});
module.exports = mongoose.model('Activity', Activity);