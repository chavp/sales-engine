var express = require('express');

var router = express.Router();
var ctrOrganizations = require('../controllers/organizations');

router.get('/organizations/:organizationId', ctrOrganizations.organizationReadOne);
router.put('/organizations/:organizationId/name', ctrOrganizations.saveOrganizationName);


module.exports = router;