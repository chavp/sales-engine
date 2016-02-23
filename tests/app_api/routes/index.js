var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var ctrAccounts = require('../controllers/accounts');
var ctrOrganizations = require('../controllers/organizations');
var ctrLeads = require('../controllers/leads');
var ctrContacts = require('../controllers/contacts');
var ctrLeadEvents = require('../controllers/lead-events');
var ctrFileUpload = require('../controllers/file-upload');

// Accounts
router.get('/accounts', auth, ctrAccounts.accounts);
router.get('/accounts/:memberId', auth, ctrAccounts.accountReadOne);
router.post('/accounts/login', ctrAccounts.login);
router.post('/accounts/signup', ctrAccounts.signup);
router.post('/accounts/password/reset', ctrAccounts.resetPassword);
router.put('/accounts/:memberId', ctrAccounts.accountUpdate);
router.put('/accounts/:memberId/profile', ctrAccounts.saveProfile);
router.put('/accounts/:memberId/email', ctrAccounts.changeEmail);
router.put('/accounts/:memberId/password', ctrAccounts.changePassword);
router.post('/accounts/:memberId/logout', ctrAccounts.logout);

// Organizations
router.get('/organizations/:organizationId', auth, ctrOrganizations.organizationReadOne);
router.put('/organizations/:organizationId/name', auth, ctrOrganizations.saveOrganizationName);

// Leads
router.get('/leads', auth, ctrLeads.leads);
router.get('/leads/members/:memberId/organizations/:organizationId', auth, ctrLeads.leadsByOwnerAndOrg);
router.get('/leads/organizations/:organizationId', auth, ctrLeads.leadsByOrg);
router.get('/leads/members/:memberId', auth, ctrLeads.leadsByMemberLiveOrg);
router.post('/leads', auth, ctrLeads.leadSave);
router.get('/leads/:leadId', auth, ctrLeads.leadById);
router.put('/leads/:leadId', auth, ctrLeads.leadUpdate);
router.delete('/leads/:leadId', auth, ctrLeads.leadDelete);

// Lead / Contacts
router.post('/leads/:leadId/contacts', auth, ctrContacts.leadSaveContact);
router.put('/contacts/:contactId', auth, ctrContacts.updateContact);
router.delete('/contacts/:contactId', auth, ctrContacts.deleteContact);
router.delete('/contactChannles/:contactChannelId', auth, ctrContacts.deleteContactChannel);

// Activities
router.get('/leads/:leadId/events/', auth, ctrLeadEvents.leadEvents);
router.post('/leads/:leadId/events/', auth, ctrLeadEvents.leadEventsDone);

// File upload
router.post('/files', auth, multipartMiddleware, ctrFileUpload.upload);

// Opportunities

// Tasks

// Reporting


module.exports = router;

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
};

// static method
module.export = sendJsonResponse;