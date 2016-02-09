var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrAccounts = require('../controllers/accounts');

router.get('/accounts', auth, ctrAccounts.accounts);
router.get('/accounts/:memberId', ctrAccounts.accountReadOne);
router.post('/accounts/login', ctrAccounts.login);
router.post('/accounts/signup', ctrAccounts.signup);
router.post('/accounts/password/reset', ctrAccounts.resetPassword);
router.put('/accounts/:memberId', ctrAccounts.accountUpdate);
router.put('/accounts/:memberId/profile', ctrAccounts.saveProfile);
router.put('/accounts/:memberId/email', ctrAccounts.changeEmail);
router.put('/accounts/:memberId/password', ctrAccounts.changePassword);
router.post('/accounts/:memberId/logout', ctrAccounts.logout);

// Leads

// Tasks

// Reporting

module.exports = router;
