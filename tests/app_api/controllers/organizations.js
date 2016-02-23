var mongoose = require('mongoose');
var helper = require('./helper');

/* GET read organization */
module.exports.organizationReadOne = function(req, res) {
	console.log('Read organization', req.params);
	if (!req.params.organizationId) {
	    helper.sendJsonResponse(res, NOT_FOUND, {
	      "message": "Not found, organization name is required"
	    });
	    return;
	}
	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT save organization */
module.exports.saveOrganizationName = function(req, res) {
	console.log('Save organization', req.body + " " + req.params);
	if (!req.body.name) {
	    helper.sendJsonResponse(res, NOT_FOUND, {
	      "message": "Not found, organization name is required"
	    });
	    return;
	}
	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};