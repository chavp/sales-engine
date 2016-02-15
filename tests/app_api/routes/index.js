var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrAccounts = require('../controllers/accounts');
var ctrOrganizations = require('../controllers/organizations');
var ctrLeads = require('../controllers/leads');

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
router.post('/leads/:leadId/contacts', auth, ctrLeads.leadSaveContact);
router.put('/leads/:leadId/contacts/:contactId', auth, ctrLeads.leadUpdateContact);
router.delete('/leads/:leadId/contacts/:contactId', auth, ctrLeads.leadDeleteContact);

// Tasks

// Reporting

module.exports = router;

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
};

// static method
module.export = sendJsonResponse;