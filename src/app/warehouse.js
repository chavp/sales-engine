var mongoose = require('mongoose');

var User = require('./models/user');
var Organization = require('./models/organization');
var Lead = require('./models/lead');
var Helpers = require('./models/helper');
var request = require('request');
var nodemailer = require("nodemailer");
var icalendar = require("icalendar");
var _host = 'http://127.0.0.1/';

//var _host = 'crm.pushthetraffic.com';
var Imap = require('imap'),
    inspect = require('util').inspect;
    
module.exports = function (app, express) {
    var api = express.Router();
    ////////////////error custom format
    function formateError(err) {
        var count = 0;
        for (var errName in err.errors) {
            count++;
        }
        var replay = [];
        var result;
        var first;
        for (var i = 0; i < count; i++) {
            first = err.errors[Object.keys(err.errors)[i]];
            replay.push({ type: '0', message: first.message });
        }
        result = { type: "0", errors: replay }
        if (result.errors.length > 0)
            return result;
        else
            return err;
    }
    ///////////////Test Api Connection
    api.get('/', function (req, res) {

        res.json({ type: 'success', data: 'Warehouse is working great' });
    });
    function CheckIMAP(settings, cb) {
        var imap = new Imap({
            user: settings.Username,
            password: settings.Password,
            host: settings.IMAPHost,
            port: settings.IMAPPort,
            tls: true
        });
        var Emails = [];
        function openInbox(cb) {
            imap.openBox('INBOX', false, cb);
        }

        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) throw err;
                return true;
            });
        });

        imap.once('error', function (err) {
            //console.log(err);
        });

        imap.once('end', function () {
            //console.log('Connection ended');
        });

        imap.connect();
    }
    function IMAP(settings, cb) {
        var imap = new Imap({
            user: settings.email,
            password: settings.password,
            host: settings.host,
            port: settings.port,
            tls: true
        });
        var Emails = [];
        function openInbox(cb) {
            imap.openBox('INBOX', false, cb);
        }

        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) throw err;
                imap.search(['UNSEEN', ['SINCE', 'October 2, 2013']], function (err, results) {
                    var cnt = imap._box.messages.total - 20;
                    var limit = cnt + 20;
                    var f = imap.seq.fetch(cnt + ':' + limit, {
                        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE CC BCC)', 'TEXT'],
                        struct: true,
                        markSeen: true
                    });
                    f.on('message', function (msg, seqno) {
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            var buffer = '';
                            stream.on('data', function (chunk) {
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', function () {
                                var parsedHeader = Imap.parseHeader(buffer);
                                var bodyStart = buffer.indexOf('<html');
                                var bodyEnd = buffer.indexOf('</html>');
                                var msgBody = buffer.substr(bodyStart, bodyEnd);
                                var Email = {
                                    date: parsedHeader.date,
                                    from: parsedHeader.from,
                                    to: parsedHeader.to,
                                    subject: parsedHeader.subject,
                                    body: msgBody
                                };
                                if (typeof (Email.date) != 'undefined' && Emails.length > 0) {
                                    Emails[Emails.length - 1].date = Email.date[0].replace('<', '').replace('>', '').replace(']', '').replace('[', '').replace('\'', '').trim();
                                    Emails[Emails.length - 1].from = extractEmails(Email.from[0])[0];
                                    Emails[Emails.length - 1].to = extractEmails(Email.to[0])[0];

                                    Emails[Emails.length - 1].subject = Email.subject[0].replace('<', '').replace('>', '').replace(']', '').replace('[', '').replace('\'', '').trim();

                                }
                                else {
                                    if (typeof (Email) != 'undefined')
                                        Emails.push(Email);
                                }
                            });
                        });
                        msg.once('attributes', function (attrs) {
                            ////console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function () {
                            ////console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        //console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        ////console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', function (err) {
            //console.log(err);
        });

        imap.once('end', function () {
            //console.log('IMAP-Done');
            processEmails(Emails, settings.user);
        });

        imap.connect();
    }
    function extractEmails(text) {
        var emails = [];
        emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (emails == null || emails.length < 1) {
            emails = ['No email found']
        }
        return emails;
    }
    function processEmails(_emails, _user) {
        Lead.find({ Orgnization: _user.Organizations[0].Orgnization }, function (err, leads) {
            if (err) {

            }
            else {
                if (leads) {
                    for (var em = 0 ; em < _emails.length; em++) {
                        var foundFlag = false;
                        for (var i = 0 ; i < leads.length; i++) {
                            for (var j = 0 ; j < leads[i].Contacts.length; j++) {
                                if (typeof (leads[i].Contacts[j].Details[0]) != 'undefined' && leads[i].Contacts[j].Details[0].Value == _emails[em].from) {
                                    foundFlag = true;
                                    var Activity = {
                                        Date: Date.now(),
                                        Type: 'Email',
                                        Attributes: {
                                            To: _emails[em].to,
                                            Subject: _emails[em].subject,
                                            Text: _emails[em].body,
                                            Template: null
                                        }
                                    };
                                    leads[i].Activities.push(Activity);
                                    Lead.update({ _id: leads[i]._id }, leads[i], { upsert: true }, function (err) {
                                    });
                                }
                            }
                        }
                        if (foundFlag === false) {
                            //Lead Unkowned and needs to be created
                            var LeadSave = new Lead({
                                Title: _emails[em].from.split('@')[1] + "-VIA Email",
                                Orgnization: _user.Organizations[0].Orgnization._id,
                                CreatedBy: _user._id,
                                CurrentStatus: _user.Organizations[0].Orgnization.LeadStatus[0]._id,
                                StatusLabel: _user.Organizations[0].Orgnization.LeadStatus[0].Title,
                                Contacts: [{
                                    Name: _emails[em].from,
                                    CreatedBy: _user._id,
                                    Details: [{ Type: 'office', Value: _emails[em].from }]
                                }],
                                Activities: [
                                            {
                                                Type: 'LeadCreation',
                                                Attributes: { Text: 'Lead Created at ' + Date() }
                                            },
                                            {
                                                Date: Date.now(),
                                                Type: 'Email',
                                                Attributes: {
                                                    To: _emails[em].to,
                                                    Subject: _emails[em].subject,
                                                    Text: _emails[em].body,
                                                    Template: null
                                                }
                                            }]
                            });
                            LeadSave.save();
                            leads.push(LeadSave);
                        }
                    }
                }
            }
        });
    }
    function sendEmail(user, email) {
        var smtpTransport = nodemailer.createTransport({
            transport: "SMTP",
            host: user.EmailSettings.SMTPHost,
            secureConnection: user.EmailSettings.SMTPSSL,
            port: user.EmailSettings.SMTPPort,
            requiresAuth: true,
            auth: {
                user: user.EmailSettings.Username,
                pass: user.EmailSettings.Password
            }
        });
        var mailOptions = {
            to: email.to,
            subject: email.subject,
            html: email.text,
            cc: email.cc,
            bcc: email.bcc
        }
        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) {
                //console.log(err);
                return err;
            }
            else
                return 100;
        });
    }
    api.post('/lead/mail/send', function (req, res) {
        var smtpTransport = nodemailer.createTransport({
            transport: "SMTP",
            host: req.body.user.SMTPHost,
            secureConnection: req.body.user.SMTPSSL,
            port: req.body.user.SMTPPort,
            requiresAuth: true,
            auth: {
                user: req.body.Username,
                pass: req.body.Password
            }
        });
        var mailOptions = {
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.text
        }
        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) {
                //console.log(err);
                res.json({ type: 0, message: err });
            }
            else
                res.json({ type: 100, message: 'Email sent' });
        });
    });
    //////////////////Use registeration
    api.post('/user', function (req, res) {

        var email = req.body.Email.toLowerCase();
        if (email == null || typeof email == undefined || email.trim() == '') {
            res.json({ type: 0, message: 'Please enter a valid email' });
            return;
        }
        User.findOne({ Email: email }, function (err, resault) {
            if (err) {
                res.json(formateError(err));
                return;
            }
            else {
                if (resault) {
                    res.json({ type: '1', message: 'Duplicated email' })
                }
                else {
                    var orgData = new Organization({
                        Title: req.body.Title,
                        Size: req.body.Size,
                        DefaultCurrency: 'Dollar',
                        OpprtunityStatus: [{ Title: 'Active' }, { Title: 'Lost' }, { Title: 'Won' }],
                        LeadStatus: [{ Title: 'Potenial' }, { Title: 'Bad fit' }, { Title: 'Qualified' }, { Title: 'Customer' }],
                        SmartViews: [],
                        CustomFields: [],
                        Members: [{ Name: req.body.FirstName + " " + req.body.LastName, Phone: req.body.Phone, Email: req.body.Email, Role: 'Admin', Plan: 'Trail', Status: 'Active' }]
                    });
                    var OrgID;
                    var UserId;
                    var leadId;
                    orgData.save(function (err) {
                        if (err) {
                            res.json(formateError(err));
                            return;
                        }
                        else {
                            OrgID = orgData._id;
                            var dataUser = req.body;
                            var userSave = new User({
                                FirstName: req.body.FirstName,
                                LastName: req.body.LastName,
                                Email: req.body.Email,
                                EmailLower: req.body.Email.toLowerCase(),
                                Password: req.body.Password,
                                Phone: req.body.Phone,
                                Organizations: [{ Orgnization: OrgID, Role: 'Admin', Status: 'Active', Plan: 'Business' }],
                                EmailSettings: [],
                                Img: "../../images/person.png"
                            });
                            userSave.save(function (err) {
                                if (err) {
                                    res.json(formateError(err));
                                    return;
                                }
                                else {
                                    userid = userSave._id;
                                    var sampleLead = new Lead({
                                        Title: 'Sample lead',
                                        Description: 'This is a sample lead you can remove',
                                        URL: 'http://www.deltacode.co',
                                        CurrentStatus: orgData.LeadStatus[0]._id,
                                        StatusLabel: orgData.LeadStatus[0].Title,
                                        Orgnization: OrgID,
                                        CreatedBy: userid,
                                        Tasks: [
                                           { CreatedBy: userid, Time: "12:00pm", Title: 'This is a sample task', AssignedTo: userid, AssignedToLabel: userSave.FirstName + " " + userSave.LastName },
                                           { CreatedBy: userid, Time: "12:00pm", Title: 'This is a sample task (2)', AssignedTo: userid, AssignedToLabel: userSave.FirstName + " " + userSave.LastName }

                                        ],
                                        Opportunities: [
                                           {
                                               Value: 5000,
                                               Currancy: 'USD',
                                               Confidence: '85',
                                               Note: 'This is a sample opprtunity',
                                               CreatedBy: userid,
                                               CurrentStatus: orgData.OpprtunityStatus[0]._id,
                                               StatusLabel: orgData.OpprtunityStatus[0].Title,
                                               AssignedToLabel: 'Amir Aly',
                                               LeadLabel: 'Sample Lead',
                                               AssignedTo: userid,
                                               Repetion: 'Annual'
                                           },
                                           {
                                               Value: 3500,
                                               Currancy: 'USD',
                                               Confidence: '70',
                                               Note: 'This is a sample opprtunity (2)',
                                               CreatedBy: userid,
                                               CurrentStatus: orgData.OpprtunityStatus[0]._id,
                                               StatusLabel: orgData.OpprtunityStatus[0].Title,
                                               AssignedToLabel: 'Amir Aly',
                                               LeadLabel: 'Sample Lead',
                                               AssignedTo: userid,
                                               Repetion: 'Monthly'
                                           }
                                        ],
                                        CustomFeilds: [{
                                            Name: 'Sample Choice feild',
                                            Type: 'Choices',
                                            Values: 'Anuall , Monthly , Daily',
                                            CurrentValue: 'Monthly'
                                        }, {
                                            Name: 'Sample Date feild',
                                            Type: 'Date',
                                            Values: '',
                                            CurrentValue: '12/12/2015'
                                        }],
                                        Contacts: [{
                                            Name: 'Amir Aly Ahmed',
                                            ContactTitle: 'Founder',
                                            Details:
                                                {
                                                    Value: '01211120630',
                                                    Type: 'office'
                                                },
                                            CreatedBy: userid
                                        },
                                        {
                                            Name: 'Amir Aly Ahmed',
                                            ContactTitle: 'Founder',
                                            Details:
                                                {
                                                    Value: 'amir-aly-eesa@hotmail.com',
                                                    Type: 'home'
                                                },
                                            CreatedBy: userid
                                        }],
                                        Activities: [
                                            {
                                                Type: 'LeadCreation',
                                                AssignedTo: userid,
                                                Attributes: { Text: 'Lead Created' , Date:new Date()}
                                            },
                                            {
                                                Type: 'Note',
                                                Attributes: { Text: 'This is sample note', Date: new Date() }
                                            },
                                            {
                                                Type: 'Task',
                                                AssignedTo: userid,
                                                Attributes: { Text: 'This is a sample Task', Date: new Date() }
                                            },
                                            {
                                                Type: 'Task',
                                                AssignedTo: userid,
                                                Due: new Date(2020, 1, 1).getTime(),
                                                Attributes: { Text: 'This is a future task, it appears here till its time come.', Date: new Date() }
                                            },
                                            {
                                                Type: 'MissedCall',
                                                AssignedTo: userid,
                                                Attributes: { Text: 'A Missed Call from Amir Aly Ahmed in 12:00 PM', Date: new Date() }
                                            },
                                            {
                                                Type: 'VoiceMail',
                                                AssignedTo: userid,
                                                Attributes: { Text: 'A Voice mail  from Amir Aly Ahmed in 12:00 PM, click to play', Date: new Date() }
                                            },
                                            {
                                                Type: 'Log',
                                                AssignedTo: userid,
                                                Attributes: {
                                                    Text: 'A sample call log',
                                                    Contact: 'Amir Aly Ahmed',
                                                    Number: '01211120630',
                                                    Duration: '34',
                                                    Date:new Date()
                                                }
                                            }],
                                        CreatedBy: userid
                                    });
                                    sampleLead.save(function (err) {
                                        if (err) {
                                            res.json(formateError(err));
                                            //console.log(err);
                                        }
                                        else {
                                            leadId = sampleLead._id;
                                            orgData.save(function (err) {
                                                if (err) {
                                                    res.json(formateError(err));
                                                }
                                                else {
                                                    User.findOne({ _id: userSave._id }, function (err, user) {
                                                        if (user) {
                                                            user.LastLogin = new Date();
                                                            //user.save();
                                                            if (user.EmailSettings.Ready == true) {
                                                                var settings = {
                                                                    email: user.EmailSettings.Username,
                                                                    password: user.EmailSettings.Password,
                                                                    host: user.EmailSettings.IMAPHost,
                                                                    port: user.EmailSettings.IMAPPort,
                                                                    tls: user.EmailSettings.SSL,
                                                                    user: user
                                                                };
                                                                IMAP(settings, function () {
                                                                    ////console.log('IMAP Done');
                                                                })
                                                            }
                                                            res.json({ type: '100', data: user });

                                                        }
                                                        else {
                                                            res.json({ type: '1', message: 'Email or password is incorrect' });
                                                        }
                                                    }).populate('Organizations').populate('Organizations.Orgnization').populate('Organizations.Orgnization.LeadStatus');

                                                }
                                            })
                                        }
                                    });

                                }
                            });
                        }
                    });
                }
            }
        });
    });
    /////////////////User Forgot 
    api.post('/Forgot', function (req, res) {
        User.findOne({ Email: req.body.Email }, function (err, user) {
            if (user) {
                var smtpTransport = nodemailer.createTransport({
                    transport: "SMTP",
                    host: 'smtp.gmail.com',
                    secureConnection: true,
                    port: 587,
                    requiresAuth: true,
                    auth: {
                        user: 'aali.ibtekar@gmail.com',
                        pass: '2662006AmirAmira'
                    }
                });
                var invitationURL = _host + "index.html#/Users/Reset" + user._id;
                var mailOptions = {
                    to: user.Email,
                    subject: 'Close.io | Reset your password',
                    html: 'Please use this link to reset your password <a href="' + invitationURL + '">click here</a>'
                }
                smtpTransport.sendMail(mailOptions, function (err, response) {
                    if (err) {
                        //console.log(err);
                        return err;
                    }
                    else
                        //return 100;
                        res.json({ type: '100', message: 'Email Sent' });
                });
            }
            else {
                res.json({ type: '1', message: 'Email is incorrect' });
            }
        });
    });
    /////////////////User login 
    api.post('/login', function (req, res) {
        User.findOne({ Email: req.body.Email, Password: req.body.Password }, function (err, user) {
            if (user) {
                user.LastLogin = new Date();
                //user.save();
                if (user.EmailSettings.Ready == true) {
                    var settings = {
                        email: user.EmailSettings.Username,
                        password: user.EmailSettings.Password,
                        host: user.EmailSettings.IMAPHost,
                        port: user.EmailSettings.IMAPPort,
                        tls: user.EmailSettings.SSL,
                        user: user
                    };
                    IMAP(settings, function () {
                    })
                }
                res.json({ type: '100', data: user });

            }
            else {
                res.json({ type: '1', message: 'Email or password is incorrect' });
            }
        }).populate('Organizations').populate('Organizations.Orgnization').populate('Organizations.Orgnization.LeadStatus');
    });
    ///////////////List all users for testing
    api.get('/users', function (req, res) {
        User.find({}, function (err, user) {
            if (user) {
                res.json({ type: '100', data: user });
            }
            else {
                res.json({ type: '1', message: 'Email or password is incorrect' });
            }
        });

    });
    ////////////////Clear all users
    api.get('/users/delete/5678', function (req, res) {
        User.remove({}, function (err, removed) {
            if (err)
                return formateError;
            else
                res.json({ type: '100', data: removed });
        });
    });
    ////////Clear DB
    api.get('/DB/CLEAR/5678', function (req, res) {
        Lead.remove({}, function (err, removed) {
            if (err)
                res.json(formateError(err));
            else
                Organization.remove({}, function (err, removed) {
                    if (err)
                        res.json(formateError(err));
                    else
                        User.remove({}, function (err, removed) {
                            if (err)
                                res.json(formateError(err));
                            else
                                res.json({ type: '100', data: removed });
                        });
                });
        });
    });
    ////////////// Create new lead
    api.post('/lead', function (req, res) {
        if (req.body.Title != null) {
            var LeadSave = new Lead({
                Title: req.body.Title,
                Orgnization: req.body.Orgnization,
                CreatedBy: req.body.User,
                Contacts: [{
                    Name: req.body.Contact,
                    CreatedBy: req.body.User
                }],
                Activities: [
                            {
                                Type: 'LeadCreation',
                                Attributes: { Text: 'Lead Created at ' + new Date().getTime() }
                            }]
            });
            LeadSave.save(function (err) {
                if (err) {
                    res.json(formateError(err));
                }
                else {
                    Organization.findById({ _id: req.body.Orgnization }, function (err, org) {
                        if (err) {
                            res.json(formateError(err));
                        }
                        else {
                            org.Leads.push(LeadSave._id);
                            org.save(function (err) {
                                if (err) {
                                    res.json(formateError(err));

                                }
                                else {
                                    LeadSave.CurrentStatus = org.LeadStatus[0]._id;
                                    LeadSave.StatusLabel = org.LeadStatus[0].Title;
                                    LeadSave.save(function (err) {
                                        if (err) {
                                            res.json(formateError(err));
                                        }
                                        else {
                                            res.json({ type: 100, data: LeadSave });
                                        }
                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
        else {
            res.json({ type: 'error', message: 'please  enter title' });
            return;

        }
    });
    ////////////// get  all leads with criteri as a querystring (q)
    api.get('/lead/search', function (req, res) {
        Lead.find(req.query.q, 'Title CreatedBy Orgnization CurrentStatus Contacts StatusLabel URL', function (err, leads) {
            if (leads) {
                res.json({ type: '100', data: leads });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('CreatedBy').populate('Contacts');;
    });
    ////////////////////////////Get all leads withing org
    api.get('/organization/leads', function (req, res) {
        Lead.find({ Orgnization: req.query.q }, 'Title CreatedBy Orgnization CreatedDate CurrentStatus Contacts StatusLabel Url Description', function (err, leads) {
            if (leads) {
                res.json({ type: '100', data: leads });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('CreatedBy').populate('Contacts');
    });
    // get lead by id
    api.get('/lead', function (req, res) {
        Lead.findOne({ _id: req.query.id }, 'Title Url Description CreatedBy Orgnization CurrentStatus StatusLabel Addresses Tasks Opportunities Contacts CustomFeilds', function (err, lead) {
            if (lead) {
                res.json({ type: '100', data: lead });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('Tasks')
            .populate('Contacts').populate('CreatedBy')
            .populate('Opportunities')
            .populate('CustomFeilds')
            .populate('Contacts')
            .populate('Addresses')
            .populate('Opportunities.AssignedTo');
    });
    ///////////delete lead by ID
    api.put('/lead/merge', function (req, res) {
        Lead.findOne({ _id: req.body.id }, function (err, lead) {
            if (lead) {
                Lead.findOne({ _id: req.body.toLead }, function (err, toLead) {
                    if (toLead) {
                        for (var i = 0 ; i < lead.Contacts.length; i++) {
                            var obj = lead.Contacts[i];
                            delete obj._id;
                            toLead.Contacts.push(obj);
                        }
                        for (var i = 0 ; i < lead.Tasks.length; i++) {
                            var obj = lead.Tasks[i];
                            delete obj._id;
                            toLead.Tasks.push(obj);
                        }
                        for (var i = 0 ; i < lead.Opportunities.length; i++) {
                            var obj = lead.Opportunities[i];
                            delete obj._id;
                            toLead.Opportunities.push(obj);
                        }
                        for (var i = 0 ; i < lead.Activities.length; i++) {
                            var obj = lead.Activities[i];
                            delete obj._id;
                            toLead.Activities.push(obj);
                        }
                        Lead.update({ _id: req.body.toLead }, toLead, { upsert: true }, function (err) {
                            if (err)
                                return formateError(err);
                            else {
                                lead.remove(function (err) {
                                    if (err) {
                                        res.json({ type: '3', message: formateError(err) });
                                    }
                                    else {
                                        res.json({ type: '100', message: toLead });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.json({ type: '2', message: 'No data found' });
                    }
                });
            }
            else {
                res.json({ type: '1', message: 'Leads ids sent are not correct' });
            }
        })
    });
    //Merge 2 leads
    api.put('/lead/remove', function (req, res) {
        Lead.remove({ _id: req.body.id }, function (err, removed) {
            if (err)
                return formateError;
            else
                res.json({ type: '100', data: removed });
        });
    });
    //Bulk update lead
    api.put('/lead/update', function (req, res) {
        var _type = req.body.type;
        var _newValue = req.body.newvalue;
        var _updateCounter;
        Lead.find(req.body.criteria, function (err, leads) {
            if (leads) {
                if (_type == 'ChangeStatus') {
                    Lead.update(req.body.criteria, { CurrentStatus: _newValue, CurrentStatusLabel: req.body.label }, { upsert: true, multi: true }, function (err, result) {
                        if (err)
                            res.json({ type: 0, data: err });
                        else
                            res.json({ type: '100', message: 'Update completed' });
                    });
                }
                else if (_type == 'Delete') {
                    Lead.remove(req.body.criteria, function (err) {
                        if (err) {
                            res.json({ type: 0, data: err });
                        }
                        else {
                            res.json({ type: '100', data: 'Leads have been deleted' });
                        }
                    })
                }
                else {
                    for (var i = 0; i < leads.length; i++) {
                        if (leads[i].CustomFeilds && leads[i].CustomFeilds.hasOwnProperty(_type)) {
                            Lead.update({ _id: leads[i]._id }, { _type: _newValue }, { upsert: true }, function (err) {
                                if (err)
                                    return formateError(err);
                                else {
                                    res.json({ type: '100', data: 'Leads updated succefully' });

                                }
                            });
                        }
                        else {
                            res.json({ type: '1', message: 'No leads with this custom fields' });
                        }
                    }
                }
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    //////////////////Bulk email
    api.put('/lead/bulkemail', function (req, res) {
        var _query = req.body.criteria;
        var _contactOptions = req.body.contactOptions;
        var _template = req.body.template;
        var _toList = '';
        Lead.find(req.body.criteria, 'Title Contacts', function (err, leads) {
            if (leads) {
                for (var i = 0 ; i < leads.length; i++) {
                    for (var j = 0 ; j < leads[i].Contacts.length; j++) {
                        var Contact = leads[i].Contacts[j];
                        for (var d = 0 ; d < Contact.Details.length; d++) {
                            var Detail = Contact.Details[d];
                            if (Detail.Value.indexOf('@') > -1 && Detail.Value.indexOf('.') > 3) {
                                _Email = _template.replace('%%Name%%', Contact.Name)
                                    .replace('%%Email%%', Detail.Value)
                                    .replace('%%LeadTitle%%', leads[i].Title);
                                var email =
                                        {
                                            to: Detail.Value,
                                            subject: _template.Subject,
                                            html: _Email
                                        }
                                sendEmail(req.body.user, email);
                            }
                        }
                    }
                }

                res.json({ type: '100', data: _toList });
            }
            else {
                res.json({ type: '1', data: 'No data found' });
            }
        }).populate('Contacts');
    });
    ///////////Lead send email, note and call log
    api.put('/activity/email', function (req, res) {
        Lead.findOne({ _id: req.body.lead }, function (err, lead) {
            if (lead) {
                //Templates should be maintained here
                //Email sender should be maintained here
                var Activity = {
                    Date: new Date(),
                    Type: 'Email',
                    Attributes: {
                        To: req.body.to,
                        Subject: req.body.subject,
                        Text: req.body.text,
                        Template: req.body.template,
                        SenderLabel: req.body.SenderLabel,
                        CC: req.body.cc,
                        BCC: req.body.bcc,
                        SenderEmail: req.body.SenderEmail,
                        EmailStatus: req.body.EmailStatus,
                        Attachements: req.body.Attachements
                    }
                };
                lead.Activities.push(Activity);
                var result
                if (req.body.EmailStatus == 'Sent')
                    result = sendEmail(req.body.user, req.body);
                //Remind to follow up
                //Attachements
                //    [{   // encoded string as an attachment
                //    filename: 'text1.txt',
                //    content: 'aGVsbG8gd29ybGQh',
                //    encoding: 'base64'
                //    }]
                ///
                if (req.body.remind) {
                    var remindDate = req.body.remindDate
                    lead.Tasks.push(
                                {
                                    CreatedBy: req.body.user._id,
                                    Title: 'Follow up for email: ' + req.body.subject,
                                    AssignedTo: req.body.user._id,
                                    AssignedToLabel: req.body.user.FirstName + " " + req.body.user.LastName,
                                    DueDate: req.body.remindDate,
                                    Time: "12:00pm"
                                }
                        );
                }

                Lead.update({ _id: req.body.lead }, lead, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else {
                        res.json({ type: '100', data: result });
                    }
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    api.put('/activity/note', function (req, res) {
        Lead.findOne({ _id: req.body.lead }, function (err, lead) {
            if (lead) {
                var Activity = {
                    Date: new Date(),
                    Type: 'Note',
                    Attributes: {
                        Text: req.body.text
                    }
                };
                lead.Activities.push(Activity);
                Lead.update({ _id: req.body.lead }, lead, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: 'Note created succefully' });
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    api.put('/activity/logcall', function (req, res) {
        Lead.findOne({ _id: req.body.lead }, function (err, lead) {
            if (lead) {
                var Activity = {
                    Date: new Date(),
                    Type: 'Log',
                    Attributes: {
                        Text: req.body.text,
                        Contact: req.body.contact,
                        Number: req.body.number,
                        Duration: req.body.Duration
                    }
                };
                lead.Activities.push(Activity);
                Lead.update({ _id: req.body.lead }, lead, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: 'Call logged succefully' });
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    /////////////Update lead activity
    api.put('/activity/update', function (req, res) {
        Lead.findOne({ _id: req.body.lead }, function (err, lead) {
            if (lead) {
                lead.Activities = req.body.Activities
                Lead.update({ _id: req.body.lead }, lead, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: lead.Activities });
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    ////////////Get lead activity with skip and limit
    api.get('/activity', function (req, res) {
        Lead.findOne({ _id: req.query.lead }, 'Activities', { skip: req.query.skip, limit: req.query.limit }, function (err, Acts) {
            if (Acts) {
                res.json({ type: '100', data: Acts.Activities });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    api.get('/calendar/:id', function (req, res) {
        _UserId = req.params.id;
        var ical = new icalendar.iCalendar();
        Lead.find({}, '_id Title Activities', function (err, leads) {
            if (err)
                res.json({ type: '100', data: formateError(err) });
            else {
                if (leads) {
                    var counter = 0;
                    for (var i = 0 ; i < leads.length; i++) {
                        for (var j = 0 ; j < leads[i].Activities.length; j++) {
                            if (leads[i].Activities[j].Due <= new Date().getTime() &&
                                leads[i].Activities[j].AssignedTo == _UserId &&
                                leads[i].Activities[j].Status === 'Active' &&
                                (leads[i].Activities[j].Type == 'Task'
                                ) && counter < 21) {
                                var evt = ical.addComponent('VEVENT');
                                evt.setSummary(leads[i].Title + ": " + leads[i].Activities[i].Attributes.Text);
                                var dt = new Date();
                                dt.setTime(leads[i].Activities[j].Due);
                                evt.setDate(dt, 60 * 60);
                            }
                            counter++;
                        }
                    }
                    res.send(ical.toString());
                }
                else {
                    res.json({ type: '0', data: null });
                }
            }
        });
    });

    ////////////////Update lead status
    api.put('/lead/status', function (req, res) {
        Lead.findOne({ _id: req.body.id }, function (err, lead) {
            if (lead) {
                var newStatusActivity = {
                    Date: new Date(),
                    Type: 'StatusChange',
                    Attributes: {
                        Text: 'Status changed',
                        Old: lead.CurrentStatusLabel,
                        New: req.body.statusLabel
                    }
                };
                lead.Activities.push(newStatusActivity);
                var statusHistory = {
                    From: lead.StatusLabel,
                    To: req.body.statusLabel,
                    By: req.body.user
                };
                lead.StatusHistory.push(statusHistory);
                lead.CurrentStatus = req.body.newStatusId;
                lead.StatusLabel = req.body.statusLabel;
                delete lead._id;
                Lead.update({ _id: req.body.id }, lead, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: 'Lead status updated' });
                });
            }
        });
    });
    ////////////////////Full update lead object with all subdocuments needs testing
    api.put('/lead/fullupdate', function (req, res) {
        for (var i = 0; i < req.body.Contacts.length; i++) {
            if (!req.body.Contacts[i] || !req.body.Contacts[i].Type) {

            }
            else {
                req.body.Contacts.splice(i, 1);
            }
        }
        Lead.findOne({ _id: req.body._id }, function (err, lead) {
            if (lead) {
                if (req.body.Opportunities && lead.Opportunities.length < req.body.Opportunities.length) {
                    var newOppActivity = {
                        Date: new Date(),
                        Type: 'NewOpprtunity',
                        Attributes: {
                            Text: 'New opprtunitiy created'
                        }
                    };
                    req.body.Activities.push(newOppActivity);
                }
                if (req.body.Tasks && lead.Tasks.length < req.body.Tasks.length) {
                    var newTaskActivity = {
                        Date: new Date(),
                        Type: 'NewTask',
                        Attributes: {
                            Text: 'New task created'
                        }
                    };
                    req.body.Activities.push(newTaskActivity);
                    var _newInbox = {
                        Type: 'Task',
                        Lead: lead._id,
                        LeadLabel: lead.Title,
                        CreatedDate: Date(),
                        Status: 'Active',
                        User: lead.CreatedBy,
                        UserLabel: '',
                        DueDate: Date(),
                        OriginalDate: null,
                        Attributes: {
                            Text: req.body.Tasks[req.body.Tasks.length - 1].Title
                        }
                    };
                }
                if (req.body.Tasks && lead.Tasks.length > req.body.Tasks.length) {
                    var newTaskActivity = {
                        Date: new Date(),
                        Type: 'TaskDeleted',
                        Attributes: {
                            Text: 'Task had been deleted'
                        }
                    };
                    req.body.Activities.push(newTaskActivity);
                }
                Lead.update({ _id: req.body._id }, req.body, { upsert: true }, function (err) {
                    if (err) {
                        res.json({ type: '1', data: formateError(err) });
                        return;
                    }
                    else
                        res.json({ type: '100', data: 'Data updated' });
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    api.put('/lead/inbox', function (req, res) {
        Lead.findOne({ _id: req.body._id }, function (err, lead) {
            if (lead) {
                for (var i = 0 ; i < lead.Activities.length ; i++) {
                    if (lead.Activities[i]._id == req.body.Activities._id) {
                        lead.Activities[i] = req.body.Activities;
                    }
                }
                Lead.update({ _id: req.body._id }, lead, { upsert: true }, function (err) {
                    if (err) {
                        res.json({ type: '1', errors: formateError(err) });
                        return;
                    }
                    else
                        res.json({ type: '100', data: 'Data updated' });
                });
            }
            else {
                res.json({ type: '1', message: 'No such lead' });
            }
        });
    });
    //////Snooze a task
    api.put('/lead/task/snooze', function (req, res) {
        Lead.findOne({ 'Tasks._id': req.body.id }, function (err, lead) {
            if (lead) {
                for (var i = 0 ; i < lead.Tasks.length; i++) {
                    if (lead.Tasks[i]._id == req.body.id) {
                        lead.Tasks[i].SnoozedTo = req.body.SnoozedTo;
                    }
                    lead.save(function (err) {
                        if (err)
                            res.json({ type: '1', message: formateError(err) });
                        else
                            res.json({ type: '100', data: 'Task had been snoozed' });
                    });
                }

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    api.put('/lead/task/done', function (req, res) {
        Lead.findOne({ 'Tasks._id': req.body.id }, function (err, lead) {
            if (lead) {
                for (var i = 0 ; i < lead.Tasks.length; i++) {
                    if (lead.Tasks[i]._id == req.body.id) {
                        lead.Tasks[i].SnoozedTo = req.body.SnoozedTo;
                    }
                    lead.save(function (err) {
                        if (err)
                            res.json({ type: '1', message: formateError(err) });
                        else
                            res.json({ type: '100', data: 'Task had been snoozed' });
                    });
                }

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    ///////////Deleta a lead by Id
    api.put('/lead/remove', function (req, res) {
        User.remove({ _id: req.body.id }, function (err, removed) {
            if (err)
                return formateError;
            else
                Lead.remove({}, function (err, removed) {
                    if (err)
                        return formateError;
                    else
                        Organization.remove({}, function (err, removed) {
                            if (err)
                                return formateError;
                            else
                                res.json({ type: '100', data: removed });
                        });
                });
        });
    });
    //////////////////////Update user profile
    api.put('/user/profile', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.FirstName = req.body.firstname;
                user.LastName = req.body.lastname;
                user.Img = req.body.img;
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    ////////Update user organizations
    api.put('/user/organization', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.Organizations = req.body.Organizations
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////////////////////Update user email, will affect Login info
    api.put('/user/email', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                if (user.Password == req.body.password) {
                    user.Email = req.body.email;
                    delete user._id;
                    User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                        if (err)
                            return formateError(err);
                        else
                            res.json({ type: '100', data: user });
                    });
                }
                else {
                    res.json({ type: '2', message: 'Password incorrect' });
                }
            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    ////////////////Reset your password
    api.put('/user/reset', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.Password = req.body.newpassword;
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////////////////////Change user password
    api.put('/user/password', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                if (user.Password == req.body.oldpassword) {
                    user.Password = req.body.newpassword;
                    delete user._id;
                    User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                        if (err)
                            return formateError(err);
                        else
                            res.json({ type: '100', data: user });
                    });
                }
                else {
                    res.json({ type: '2', message: 'Password incorrect' });
                }
            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////Last seen uopdated called anytime user navigates to any pages
    api.put('/user/lastseen', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.LastSeen = Date();
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////////////////////////set user email settings
    api.put('/user/settings/email', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.EmailSettings.Name = req.body.Name;
                user.EmailSettings.Username = req.body.Username;
                user.EmailSettings.Password = req.body.Password;
                user.EmailSettings.IMAPHost = req.body.IMAPHost;
                user.EmailSettings.SMTPHost = req.body.SMTPHost;
                user.EmailSettings.IMAPPort = req.body.IMAPPort;
                user.EmailSettings.SMTPPort = req.body.SMTPPort;
                user.EmailSettings.IMAPSSL = req.body.IMAPSSL;
                user.EmailSettings.SMTPSSL = req.body.SMTPSSL;
                user.EmailSettings.Ready = true;
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        res.json({ type: 0, data: formateError(err) });
                    else {
                        res.json({ type: 100, data: user });
                        var settings = {
                            email: user.EmailSettings.Username,
                            password: user.EmailSettings.Password,
                            host: user.EmailSettings.IMAPHost,
                            port: user.EmailSettings.IMAPPort,
                            tls: user.EmailSettings.SSL,
                            user: user
                        };
                        IMAP(settings, function () {
                        })
                    }
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        }).populate('Organizations').populate('Organizations.Orgnization').populate('Organizations.Orgnization.LeadStatus');

    });
    //////////////////set email signature
    api.put('/user/settings/emailsignature', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.EmailSignature = req.body.EmailSignature;
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });
            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////////////set email tracking setting
    api.put('/user/settings/emailtracking', function (req, res) {
        User.findOne({ '_id': req.body.id }, function (err, user) {
            if (user) {
                user.TrackEmails = req.body.TrackEmails;
                delete user._id;
                User.update({ _id: req.body.id }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });
            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });

    });
    //////////////////////////Create an email template
    api.post('/user/settings/emailtemplate', function (req, res) {
        User.findOne({ '_id': req.body.User }, function (err, user) {
            if (user) {
                user.EmailTemplates.push({
                    Title: req.body.Title,
                    Subject: req.body.Subject,
                    Body: req.body.Body,
                    Shared: req.body.Shared,
                    Attachements: req.body.Attachements
                });
                delete user._id;
                User.update({ _id: req.body.User }, user, { upsert: true }, function (err) {
                    if (err)
                        return formateError(err);
                    else
                        res.json({ type: '100', data: user });
                });

            }
            else {
                res.json({ type: '1', message: 'No user with this Id' });
            }
        });
    });
    ////////////////////////////////get Email Tempaltes by user
    api.get('/user/settings/emailtemplate', function (req, res) {
        User.findOne({ _id: req.query.u }, 'EmailTemplates', function (err, user) {
            if (user) {
                res.json({ type: '100', data: user });
            }
            else {
                res.json({ type: '1', message: req.query });
            }
        }).populate('EmailTemplates');
    });
    //////////////////////////////////////////////////get orgnization by userid , user id is should benin formay url?u=XXX
    api.get('/orgnization', function (req, res) {
        User.findOne({ _id: req.query.u }, 'Organizations', function (err, user) {
            if (user) {
                res.json({ type: '100', data: user });
            }
            else {
                res.json({ type: '1', message: req.query });
            }
        }).populate('Organizations.Orgnization');
    });
    /////////////get Orgnization opprtunities from org id in querystring as (org)
    api.get('/orgnization/opprtunities', function (req, res) {
        Lead.find({ Orgnization: req.query.org }, 'Opportunities', function (err, leads) {
            if (leads) {
                var Opp = [];
                for (var i = 0 ; i < leads.length; i++) {
                    for (var j = 0 ; j < leads[i].Opportunities.length; j++) {
                        leads[i].Opportunities[j].LeadId = leads[i]._id;
                        Opp.push(leads[i].Opportunities[j]);
                    }
                }
                res.json({ type: '100', data: Opp });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('Contacts');
    });
    ////////////////Get all users in this orgnization
    api.get('/orgnization/users', function (req, res) {
        User.find({ 'Organizations.Orgnization': req.query.org }, '_id FirstName LastName', function (err, users) {
            if (users) {
                res.json({ type: '100', data: users });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    /////////////////////Inbox Get by org
    api.get('/orgnization/inbox', function (req, res) {
        Lead.find({ Orgnization: req.query.org }, '_id Title Activities', function (err, leads) {
            if (err)
                res.json({ type: '100', data: formateError(err) });
            else {
                if (leads) {
                    var Inbox = [];
                    var counter = 0;
                    for (var i = 0 ; i < leads.length; i++) {
                        for (var j = 0 ; j < leads[i].Activities.length; j++) {
                            if (leads[i].Activities[j].Due <= new Date().getTime() &&
                                leads[i].Activities[j].Status === 'Active' &&
                                (leads[i].Activities[j].Type == 'Email'
                                || leads[i].Activities[j].Type == 'CreatedTask'
                                ) && counter < 21)
                                Inbox.push({
                                    LeadLabel: leads[i].Title,
                                    Activities: leads[i].Activities[j],
                                    Check: false,
                                    _id: leads[i]._id
                                });
                            counter++;
                        }
                    }
                    res.json({ type: '100', data: Inbox });
                }
                else {
                    res.json({ type: '0', data: 'No data found' });
                }
            }
        });
    });
    //////////////////////Done Inbox items
    api.get('/orgnization/inbox/done', function (req, res) {
        Lead.find({ Orgnization: req.query.org }, '_id Title Activities', function (err, leads) {
            if (err)
                res.json({ type: '100', data: formateError(err) });
            else {
                if (leads) {
                    var Inbox = []
                    for (var i = 0 ; i < leads.length; i++) {
                        for (var j = 0 ; j < leads[i].Activities.length; j++) {
                            if (
                                leads[i].Activities[j].Status === 'Done' &&
                                (leads[i].Activities[j].Type == 'Email'
                                || leads[i].Activities[j].Type == 'CreatedTask'
                                ))
                                Inbox.push({
                                    LeadLabel: leads[i].Title,
                                    Activities: leads[i].Activities[j],
                                    Check: false,
                                    _id: leads[i]._id
                                });
                        }
                    }
                    res.json({ type: '100', data: Inbox });
                }
                else {
                    res.json({ type: '0', data: 'No data found' });
                }
            }
        });
    });
    /////////////////////////////Future Inbox Items
    api.get('/orgnization/inbox/future', function (req, res) {
        Lead.find({ Orgnization: req.query.org }, '_id Title Activities', function (err, leads) {
            if (err)
                res.json({ type: '100', data: formateError(err) });
            else {
                if (leads) {
                    var Inbox = []
                    for (var i = 0 ; i < leads.length; i++) {
                        for (var j = 0 ; j < leads[i].Activities.length; j++) {
                            var _Due = leads[i].Activities[j].Due
                            if (leads[i].Activities[j].Due.indexOf('-') > 0) {
                                _Due = new Date(leads[i].Activities[j].Due).getTime();
                            }
                            if (_Due >= new Date().getTime() &&
                                leads[i].Activities[j].Status === 'Active' &&
                                (leads[i].Activities[j].Type == 'Email'
                                || leads[i].Activities[j].Type == 'CreatedTask'
                                ))
                                Inbox.push({
                                    LeadLabel: leads[i].Title,
                                    Activities: leads[i].Activities[j],
                                    Check: false,
                                    _id: leads[i]._id
                                });
                        }
                    }
                    res.json({ type: '100', data: Inbox });
                }
                else {
                    res.json({ type: '0', data: 'No data found' });
                }
            }
        });
    });
    //////////////////////Online users
    ////////////////Get all users in this orgnization
    api.get('/orgnization/users/online', function (req, res) {
        User.find({ 'Organizations.Orgnization': req.query.org }, '_id FirstName LastName LastSeen', function (err, users) {
            if (users) {
                var onlineUsers = [];
                for (var i = 0 ; i < users.length; i++) {
                    var date1 = new Date(Date());
                    var date2 = new Date(users[i].LastSeen);
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    var diff = Math.ceil(timeDiff / (1000 * 60));
                    if (diff < 5)
                        onlineUsers.push(users[i]);
                }
                res.json({ type: '100', data: onlineUsers });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    /////////////////////Creates an orgnization and pushes it into user array
    api.post('/orgnization', function (req, res) {
        if (req.body.Title != null) {
            var orgData = new Organization({
                Title: req.body.Title,
                Size: req.body.Size,
                DefaultCurrency: 'Dollar',
                CreatedBy: req.body.User,
                OpprtunityStatus: [{ Title: 'Active' }, { Title: 'Lost' }, { Title: 'Won' }],
                LeadStatus: [{ Title: 'Potenial' }, { Title: 'Bad fit' }, { Title: 'Qualified' }, { Title: 'Customer' }],
                SmartViews: [],
                CustomFields: [],
                Members: [{ Name: req.body.FirstName + " " + req.body.LastName, Phone: req.body.Phone, Email: req.body.Email, Role: 'Admin', Plan: 'Trail', Status: 'Active' }]
            });
            orgData.save(function (err) {
                if (err) {
                    res.json(formateError(err));
                }
                else {
                    User.findOne({ '_id': req.body.User }, function (err, user) {
                        if (user) {
                            user.Organizations.push({
                                Orgnization: orgData._id,
                                Role: 'Admin'
                            });
                            delete user._id;
                            User.update({ _id: req.body.User }, user, { upsert: true }, function (err) {
                                if (err)
                                    return formateError(err);
                                else
                                    res.json({ type: '100', data: orgData });
                            });

                        }
                        else {
                            res.json({ type: '1', message: 'No user with this Id' });
                        }
                    });
                }
            });
        }
        else {
            res.json({ type: 'error', message: 'please  enter title' });
            return;

        }
    });
    ////////////////////Get lead status list
    api.get('/orgnization/leadstatus', function (req, res) {
        Organization.findOne({ _id: req.query.org }, 'LeadStatus', function (err, Obj) {
            if (Obj) {
                res.json({ type: '100', data: Obj.LeadStatus });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('LeadStatus');
    });
    ////////////////////Get Opp Status List
    api.get('/orgnization/opprtunitystatus', function (req, res) {
        Organization.findOne({ _id: req.query.org }, 'OpprtunityStatus', function (err, Obj) {
            if (Obj) {
                res.json({ type: '100', data: Obj.OpprtunityStatus });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        }).populate('OpprtunityStatus');
    });
    ///////////////update lead status list
    api.put('/orgnization/leadstatus', function (req, res) {
        Organization.findOne({ _id: req.body.id }, function (err, Obj) {
            if (Obj) {
                Obj.LeadStatus = req.body.LeadStatus;
                Obj.save(function (err) {
                    if (err)
                        res.json({ type: '1', message: formateError(err) });
                    else
                        res.json({ type: '100', data: 'List had been updated' });
                });

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    //Inbox Update
    api.put('/orgnization/inbox/update', function (req, res) {
        Organization.findOne({ _id: req.body.id }, function (err, Obj) {
            if (Obj) {
                Obj.Inbox = req.body.Inbox;
                Obj.save(function (err) {
                    if (err)
                        res.json({ type: '1', message: formateError(err) });
                    else
                        res.json({ type: '100', data: 'Inbox had been updated' });
                });

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    /////////////new Smart view
    api.post('/organization/smartview', function (req, res) {
        Organization.findOne({ _id: req.body.Organization }, function (err, Obj) {
            if (Obj) {
                Obj.SmartViews.push(req.body);
                Obj.save(function (err) {
                    if (err)
                        res.json({ type: '1', message: formateError(err) });
                    else
                        res.json({ type: '100', data: 'Views had been updated' });
                });

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    ////////////////Updaye opp status list
    api.put('/orgnization/opprtunitystatus', function (req, res) {
        Organization.findOne({ _id: req.body.id }, function (err, Obj) {
            if (Obj) {
                Obj.OpprtunityStatus = req.body.OpprtunityStatus;
                Obj.save(function (err) {
                    if (err)
                        res.json({ type: '1', message: formateError(err) });
                    else
                        res.json({ type: '100', data: 'List had been updated' });
                });

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    /////////////////////Update Org
    api.post('/smartviews/remove/', function (req, res) {
        var org = req.body.org;
        var name = req.body.name;
        return Organization.findOneAndUpdate(
          { _id: org },
          { $pull: { SmartViews: { Name: name } } },
          function (err, org) {
              res.json({ code: '100', data: org });

          });
    });
    api.put('/organization', function (req, res) {
        Organization.findOne({ _id: req.body._id }, function (err, Obj) {
            if (Obj) {
                delete Obj._id;
                if (req.body.Inv) {
                    var newInv = req.body.Members[req.body.Members.length - 1];
                    var smtpTransport = nodemailer.createTransport({
                        transport: "SMTP",
                        host: 'smtp.gmail.com',
                        secureConnection: true,
                        port: 587,
                        requiresAuth: true,
                        auth: {
                            user: 'aali.ibtekar@gmail.com',
                            pass: '2662006AmirAmira'
                        }
                    });
                    //var invitationURL = window.location.protocol + "//" + window.location.host + "/dashboard.html#/invitations/" + newInv.Email
                    var invitationURL = _host + "index.html#/invitations/" + req.body._id + "/" + newInv.Email;
                    var mailOptions = {
                        to: newInv.Email,
                        subject: 'Close.io | you have been invited',
                        html: 'You have been invited to join ' + Obj.Title + ' on Close.io<br/>Please <a href="' + invitationURL + '">click here</a> to accept the invitation'
                    }
                    smtpTransport.sendMail(mailOptions, function (err, response) {
                        if (err) {
                            //console.log(err);
                            return err;
                        }
                        else
                            return 100;
                    });
                }
                Organization.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, Obj) {
                    if (err)
                        return formateError(err);
                    else {
                        res.json({ type: '100', data: req.body });
                    }
                });
            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    ///////////////Remove a lead status 
    api.put('/orgnization/removeleadstatus', function (req, res) {
        Organization.findOne({ _id: req.body.id }, function (err, Obj) {
            if (Obj) {
                var index = -1;
                for (var i = 0 ; i < Obj.LeadStatus.length; i++) {
                    if (Obj.LeadStatus[i]._id == req.body.statusId)
                        index = i;
                }
                if (index == -1) {
                    res.json({ type: '3', data: 'No such status' });
                    return;
                }
                else {
                    Lead.update({ CurrentStatus: req.body.statusId }, { CurrentStatus: req.body.newStatusId }, { upsert: false }, function (err) {
                        if (err)
                            return formateError(err);
                        else {
                            Obj.LeadStatus.splice(index, 1);
                            Obj.save(function (err) {
                                if (err)
                                    res.json({ type: '2', message: formateError(err) });
                                else
                                    res.json({ type: '100', data: 'List had been updated' });
                            });
                        }
                    });

                }

            }
            else {
                res.json({ type: '1', message: 'No data found' });
            }
        });
    });
    ///////////////Accept invitations
    api.post('/invitations/accept', function (req, res) {
        var email = req.body.Email.toLowerCase();
        if (email == null || typeof email == undefined || email.trim() == '') {
            res.json({ type: 0, message: 'Please enter a valid email' });
            return;
        }
        User.findOne({ Email: email }, function (err, resault) {
            if (err) {
                res.json(formateError(err));
                return;
            }
            else {
                if (resault) {
                    res.json({ type: '1', message: 'Duplicated email' })
                }
                else {
                    Organization.findOne({ _id: req.body.Organization }, function (err, Obj) {
                        if (Obj) {
                            var _Inv = null;
                            for (var i = 0 ; i < Obj.Members.length; i++) {
                                if (Obj.Members[i].Email == req.body.Email) {
                                    _Inv = Obj.Members[i];
                                }
                            }
                            if (_Inv == null) {
                                res.json({ code: '2', data: 'Invalid invitation, not invited to this organization' })
                                return;
                            }
                            else if (_Inv.Status != 'Invited') {
                                res.json({ code: '3', data: 'Invalid invitation status' })
                                return;
                            }
                            _Inv.Name = req.body.Firstname + " " + req.body.Lastname;
                            _Inv.Phone = req.body.Phone;
                            var userSave = new User({
                                FirstName: req.body.Firstname,
                                LastName: req.body.Lastname,
                                Email: req.body.Email,
                                EmailLower: req.body.Email.toLowerCase(),
                                Password: req.body.Password,
                                Phone: req.body.Phone,
                                Organizations: [{ Orgnization: Obj._id, Role: _Inv.Role, Status: 'Active', Plan: _Inv.Plan }],
                                EmailSettings: []
                            });
                            userSave.save(function (err, _user) {
                                if (err) {
                                    res.json(formateError(err));
                                    return;
                                }
                                else {
                                    _Inv.Status = 'Active';
                                    Organization.update({ _id: req.body.Organization }, Obj, { upsert: true }, function (err, Obj) {
                                        if (err)
                                            return formateError(err);
                                        else {
                                            res.json({ code: '100', data: userSave })
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.json({ code: '1', data: 'Invalid invitation info' })
                        }
                    });

                }
            }
        });
    });

    return api;
};