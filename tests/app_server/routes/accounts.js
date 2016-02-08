var express = require('express');
var router = express.Router();
var ctrlAccounts = require('../controllers/accounts');

/* Account pages */
router.get('/login', ctrlAccounts.login);
router.get('/members', ctrlAccounts.members);
router.get('/members/:memberId', ctrlAccounts.membersReadOne);
router.post('/members/:memberId', ctrlAccounts.updateMember);

module.exports = router;