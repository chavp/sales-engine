var express = require('express');
var router = express.Router();

var ctrlMain = require('../controllers/main');
var ctrlAccount = require('../controllers/account');


/* Login */
router.get('/login', ctrlAccount.login);

router.get('/', ctrlMain.index);

module.exports = router;