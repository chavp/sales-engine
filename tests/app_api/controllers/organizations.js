var mongoose = require('mongoose');

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET read organization */
module.exports.organizationReadOne = function(req, res) {
	console.log('Read organization', req.params);
	if (!req.params.organizationId) {
	    sendJsonResponse(res, NOT_FOUND, {
	      "message": "Not found, organization name is required"
	    });
	    return;
	}
	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT save organization */
module.exports.saveOrganizationName = function(req, res) {
	console.log('Save organization', req.body + " " + req.params);
	if (!req.body.name) {
	    sendJsonResponse(res, NOT_FOUND, {
	      "message": "Not found, organization name is required"
	    });
	    return;
	}
	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};