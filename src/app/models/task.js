

var mongoose = require('mongoose');
// define our Lead model
var StatusTips = ['Enable', 'Disable']
var Schema = mongoose.Schema;
var TypeTasks = ['lead', 'IncomingEmail', 'EmailFollowUp', 'MissedCall', 'VoiceMail', 'Opportunity', 'Tasks', 'AnsweredDetachedCall']

//var RequiredEmptyValidator = [function (val) {
//    var TestVal = val.trim();
//    return (TestVal.length > 0)

//}, '{PATH} cannot be empty']

var Tasks = new Schema({
    Type: { type: String, enum: TypeTasks, required: 'please enter type of task'},
    ObjectId: { type: String, required: 'please enter Object'},
    ObjectType: { type: String, required: 'please enter Object Type '},
    AssignTo: { type: Schema.Types.ObjectId, ref: 'User', required: 'please enter assign to any one  ' },
    AssignName: { type: String, required: 'please enter assign name' },
    IsComplete: { type: Boolean, default: false },
    IsDateLess: { type: Boolean, default: false },
    Date:{type:Date,required: 'please enter date of task'},
    LeadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: 'please enter lead'},
    LeadName: { type: String, required: 'please enter lead  name'},
    Organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization'},
    Text: { type: String, required: 'please enter text task'},
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: 'please enter user' },
    CreatedByName: { type: String, required: 'please enter name'},
    CreatedDate: { type: Date, default: Date.now },
    UpdatedDate: { type: Date },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    UpdatedByName: { type: String },
    ContactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    ContactName: { type: String }

});
module.exports = mongoose.model('Tasks', Tasks);