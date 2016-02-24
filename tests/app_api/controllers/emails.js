var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');

// POST saveEmail
module.exports.saveEmail = function(req, res) {
	console.log('POST saveEmail', req.body);
	if(!req.body.memberId){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found member Id"
		});
		return;
	}

	if(!req.body.leadId){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id"
		});
		return;
	}

	Member
		.findById(req.body.memberId)
		.exec(function(err, mem){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }
	        if (!mem) {
	          //console.log(err);
	          helper.sendJsonResponse(res, NOT_FOUND, {
				"message": "Not found member"
			  });
	          return;
	        }

	        Lead
				.findById(req.body.leadId)
				.exec(function(err, lead){
					if (err) {
			          //console.log(err);
			          helper.sendJsonResponse(res, BAD_REQUEST, err);
			          return;
			        }
			        if (!lead) {
			          //console.log(err);
			          helper.sendJsonResponse(res, NOT_FOUND, {
						"message": "Not found lead"
					  });
			          return;
			        }

			        var compose = new Compose({
			        	createdBy: mem,
			        	lead: lead,
			        	from: req.body.from,
			        	to: req.body.to,
			        	cc: req.body.cc,
			        	bcc: req.body.bcc,
			        	subject: req.body.subject,
			        	content: req.body.content,
			        	attachs: req.body.attachs,
			        	status: req.body.status
					});

			        compose.save(function(err){
						if (err) {
				          //console.log(err);
				          helper.sendJsonResponse(res, BAD_REQUEST, err);
				          return;
				        }

				        helper.sendJsonResponse(res, OK, compose);
					});
				});
		});
}