var mongoose = require('mongoose');
var RepetitionType = ['OneTime', 'Monthly', 'Annual']
var Plan = ['Basic(65$/user/mo.)', 'Pro(110$/user/mo.)', 'Business(165$/user/mo.)', ' save 10% in Year(702$/user/year) ']
var Schema = mongoose.Schema;





var Opportunity = new Schema({
    Value: { type: String, required: 'Please Enter Value  of Opportunity', trim: [true, 'Please Enter Value  of Opportunity'] },
    Currancy: { type: Number, required: 'Please Enter Value Currency', trim: [true, 'Please Enter Value   Currency'] },
    Confidence: { type: Number, required: 'Please Enter Confidence', trim: [true, 'Please Enter Value  of Confidence'], min: 0, max: 100 },
    Note: { type: String, required: 'Please Enter Note', trim: [true, 'Please Enter Note'] },
    DateOpen: { type: Date, default: Date.now },
    DateClosed: { type: Date },
    CreatedDate: { type: Date, default: Date.now },
    CreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    CurrentStatus: { type: String },
    AssignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    UpdatedDate: { type: Date },
    UpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    Contact: { type: Schema.Types.ObjectId, ref: 'Contacts' },
    Repetion: { type: String, enum: RepetitionType },
    Lead: { type: Schema.Types.Object, ref: 'Lead',required: 'Please Enter Lead ' },
    Orgnization: { type: Schema.Types.Object, ref: 'Organization', required: 'Please Enter organization ' }
});
module.exports = mongoose.model('Opportunity', Opportunity);