var express = require('express');
var router = express.Router();
var ctrlAccounts = require('../controllers/accounts');

/* Account pages */
router.get('/login', ctrlAccounts.login);


module.exports = router;