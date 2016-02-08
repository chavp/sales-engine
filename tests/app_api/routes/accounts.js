var express = require('express');
var router = express.Router();
var ctrAccounts = require('../controllers/accounts');

router.get('/accounts', ctrAccounts.accounts);
router.get('/accounts/:memberId', ctrAccounts.accountReadOne);
router.post('/accounts/login', ctrAccounts.login);
router.post('/accounts/signup', ctrAccounts.signup);
router.post('/accounts/reset_password', ctrAccounts.resetPassword);
router.put('/accounts/:memberId', ctrAccounts.accountUpdate);
router.put('/accounts/:memberId/save_profile', ctrAccounts.saveProfile);
router.put('/accounts/:memberId/change_email', ctrAccounts.changeEmail);
router.put('/accounts/:memberId/change_password', ctrAccounts.changePassword);
router.post('/accounts/:memberId/logout', ctrAccounts.logout);

// Leads

// Tasks

// Reporting

module.exports = router;
