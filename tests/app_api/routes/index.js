var express = require('express');
var router = express.Router();
var ctrAccount = require('../controllers/account');

// Account
router.get('/account/:userName', ctrAccount.account);
router.post('/account/login', ctrAccount.login);
router.post('/account/signup', ctrAccount.signup);
router.put('/account/reset-password', ctrAccount.resetPassword);
router.put('/account/save-profile', ctrAccount.saveProfile);
router.put('/account/change-email', ctrAccount.changeEmail);
router.put('/account/change-password', ctrAccount.changePassword);
router.post('/account/logout', ctrAccount.logout);

// Organizations

// Leads

// Tasks

// Reporting

module.exports = router;
