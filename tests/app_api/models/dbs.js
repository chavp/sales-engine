var mongoose = require('mongoose');

// BRING IN YOUR SCHEMAS & MODELS
require('./members');
require('./member-profiles');
require('./organizations');
require('./organization-roles');
require('./leads');

Member = mongoose.model('Member');
MemberProfile = mongoose.model('MemberProfile');
Organization = mongoose.model('Organization');
OrganizationRole = mongoose.model('OrganizationRole');
Lead = mongoose.model('Lead');