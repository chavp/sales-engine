var mongoose = require('mongoose');
var helper = require('./helper');

// GET all leads
module.exports.leads = function(req, res) {
	//console.log('Leads', req.params);
	Lead
		.find({})
		.exec(function(err, leads){
			helper.sendJsonResponse(res, OK, leads);
			//return leads;
		});
};

// GET by memberId, orgId
module.exports.leadsByOwnerAndOrg = function(req, res) {
	console.log('Leads', req.params);
	Lead
		.find({
			createdBy: req.params.memberId,
			organization: req.params.organizationId
		})
		.exec(function(err, leads){
			helper.sendJsonResponse(res, OK, leads);
			//return leads;
		});
};

// GET by orgId
module.exports.leadsByOrg = function(req, res) {
	console.log('Leads', req.params);
	Lead
		.find({
			organization: req.params.organizationId
		})
		.exec(function(err, leads){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }
			helper.sendJsonResponse(res, OK, leads);
			//return leads;
		});
};

// GET by member live organization
module.exports.leadsByMemberLiveOrg = function(req, res) {
	console.log('Leads', req.params);
	Member
	  .findById(req.params.memberId)
      .exec(function(err, mem){
  		if (err) {
          //console.log(err);
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!mem) {
          //console.log(err);
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        Lead
			.find({
				organization: mem.liveOrganization
			})
			.exec(function(err, leads){
				if (err) {
		          //console.log(err);
		          helper.sendJsonResponse(res, BAD_REQUEST, err);
		          return;
		        }
				helper.sendJsonResponse(res, OK, leads);
				//return leads;
			});
      });
};