var mongoose = require('mongoose');

// BRING IN YOUR SCHEMAS & MODELS
require('./members');
require('./member-profiles');
require('./organizations');
require('./organization-roles');
require('./leads');
require('./contacts');
require('./contact-channels');
require('./default-lead-statuses');
require('./default-opportunity-statuses');
require('./questions');
require('./choices');
require('./lead-events');
require('./composes');
require('./lead-tags');
require('./attach-files');
//require('./question-choices');

Member = mongoose.model('Member');
MemberProfile = mongoose.model('MemberProfile');
Organization = mongoose.model('Organization');
OrganizationRole = mongoose.model('OrganizationRole');
Lead = mongoose.model('Lead');
Contact = mongoose.model('Contact');
ContactChannel = mongoose.model('ContactChannel');
DefaultLeadStatus = mongoose.model('DefaultLeadStatus');
DefaultOpportunityStatus = mongoose.model('DefaultOpportunityStatus');
Question = mongoose.model('Question');
Choice = mongoose.model('Choice');
LeadEvent = mongoose.model('LeadEvent');
Compose = mongoose.model('Compose');
LeadTag = mongoose.model('LeadTag');
AttachFile = mongoose.model('AttachFile');
//QuestionChoice = mongoose.model('QuestionChoice');