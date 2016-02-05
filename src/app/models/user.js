var mongoose = require('mongoose');


/*here all enum data and it is fixed*/
var UserStatus = ['Enabled', 'Disabled'];
var MailSetupStatus = ['IMAP', 'STMP'];
var Role = ['Admin', 'User'];
var InvitationStatus = ['Enabled', 'Disabled'];
var Plan = ['Basic', 'Pro', 'Business', 'Trial'];
var schemaOptions = {
    toJSON: {
        virtuals: true
    }
};

var RequiredEmptyValidator = [function (val) {
    var TestVal = val.trim();
    return (TestVal.length > 0)
}, '{PATH} cannot be empty']
function validatorPassword(v) {
    return v.length > 8;
};
function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
var emailRegex = /^(?:\w+[\-\.])*\w+@(?:\w+[\-\.])*\w+\.\w+$/;
var phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

var Schema = mongoose.Schema;
var User = new Schema({
    FirstName: { type: String, required: 'please enter your  first name', validate: RequiredEmptyValidator },
    LastName: { type: String, required: 'Please enter Your last name', validate: RequiredEmptyValidator },
    Email: { type: String, required: 'Please enter Your email', match: [emailRegex, 'please enter correct email'] },
    Password: { type: String, required: 'Please enter Your Password', validate: RequiredEmptyValidator, validate: [validatorPassword, 'Min Password 8 Char'] },
    Img: { type: String },
    ApiKey: { type: String },
    UserStatus: { type: String, enum: UserStatus, default: 'Enabled' },
    LastLogin: { type: Date, default: Date.now },
    CreatedDate: { type: Date, default: Date.now },
    UpdatedDate: { type: Date, default: Date.now },
    Phone: { type: String, match: [phoneRegex, 'please enter correct Phone'], required: 'please enter your Phone Number', validate: RequiredEmptyValidator },
    ExpireDate: { type: Date },
    CurrentPlan: { type: String, enum: Plan },
    Organizations: [{
        Orgnization: { type: Schema.Types.ObjectId, ref: 'Organization', required: 'please enter organization' },
        Role: { type: String, enum: Role, default: 'User' },
        Status: { type: String },
        Plan: { Type: String }
    }],
    EmailSettings: {
        Name: { type: String, default: this.FirstName },
        Username: { type: String, default: this.Email },
        Password: { type: String },
        IMAPHost: { type: String },
        SMTPHost: { type: String },
        IMAPPort: { type: Number },
        SMTPPort: { type: Number },
        IMAPSSL: { type: Boolean },
        SMTPSSL: { type: Boolean },
        Ready: { type: Boolean, default: false }
    },
    EmailReady: { Type: Boolean, default: false },
    EmailSignature: { type: String },
    TrackEmails: { type: Boolean },
    SecretEmail: { type: String, default: randomString() + "@domain.com" },
    LastSeen: { type: Date },
    EmailTemplates: [{
        Title: { type: String },
        Subject: { type: String },
        Body: { type: String },
        Shared: { type: Boolean },
        Attachements: [{ Name: { type: String }, Content: { type: String } }]
    }],
});
module.exports = mongoose.model('User', User);











