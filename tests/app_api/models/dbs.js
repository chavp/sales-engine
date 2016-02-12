var mongoose = require('mongoose');

// BRING IN YOUR SCHEMAS & MODELS
require('./members');
require('./member-profiles');
require('./organizations');
require('./organization-roles');
require('./leads');
require('./contacts');
require('./contact-types');
require('./default-lead-statuses');
require('./default-opportunity-statuses');
require('./questions');
require('./choices');
//require('./question-choices');

Member = mongoose.model('Member');
MemberProfile = mongoose.model('MemberProfile');
Organization = mongoose.model('Organization');
OrganizationRole = mongoose.model('OrganizationRole');
Lead = mongoose.model('Lead');
Contact = mongoose.model('Contact');
Contact = mongoose.model('Contact');
ContactType = mongoose.model('ContactType');
DefaultLeadStatus = mongoose.model('DefaultLeadStatus');
DefaultOpportunityStatus = mongoose.model('DefaultOpportunityStatus');
Question = mongoose.model('Question');
Choice = mongoose.model('Choice');
//QuestionChoice = mongoose.model('QuestionChoice');