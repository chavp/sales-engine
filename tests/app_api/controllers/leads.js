var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');

// GET all leads
module.exports.leads = function(req, res) {
	//console.log('Leads', req.params);
	Lead
		.find({})
		.sort({createdAt: 'desc'})
		.exec(function(err, leads){

			// get first contact
			helper.sendJsonResponse(res, OK, leads);
			//return leads;
		});
};

// GET by memberId, orgId
module.exports.leadsByOwnerAndOrg = function(req, res) {
	console.log('GET leadsByOwnerAndOrg', req.params);
	Lead
		.find({
			createdBy: req.params.memberId,
			organization: req.params.organizationId
		})
		.sort({createdAt: 'desc'})
		.exec(function(err, leads){
			helper.sendJsonResponse(res, OK, leads);
			//return leads;
		});
};

// GET by orgId
module.exports.leadsByOrg = function(req, res) {
	console.log('GET leadsByOrg', req.params);
	Lead
		.find({
			organization: req.params.organizationId
		})
		.populate('contacts')
		.sort({createdAt: 'desc'})
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
	console.log('GET leadsByMemberLiveOrg', req.params);
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
			.populate('contacts')
			.sort({createdAt: 'desc'})
			.exec(function(err, leads){
				if (err) {
		          //console.log(err);
		          helper.sendJsonResponse(res, BAD_REQUEST, err);
		          return;
		        }

		        // get first contact
		        async.eachSeries(
			     	leads, 
			     	function iteratee(lead, done) {
			     		Contact
			     			.populate(lead.contacts, {
			     				path: 'contactChannels'
			     			}, function(err, conChannels){
			     				done();
			     			});
			     	}, 
			     	function done() {
						helper.sendJsonResponse(res, OK, leads);
					});
				//return leads;
			});
      });
};

// POST create lead
module.exports.leadSave = function(req, res) {
	console.log('POST leadSave', req.body);
	Member
		.findById(req.body.memberId)
		.exec(function(err, mem){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }

	        Lead
	        	.create({
	        		companyName: req.body.companyName || req.body.contactName,
	 				organization: mem.liveOrganization,
	 				createdBy: mem
	        	}, function(err, lead){
	        		 if (err) {
			          //console.log(err);
			          helper.sendJsonResponse(res, BAD_REQUEST, err);
			          return;
			        }

			        helper.sendJsonResponse(res, OK, 
						{ "message": "Save lead completed." }
					);
	        	});
		});
};

// GET get by ID
module.exports.leadById = function(req, res) {
	console.log('GET leadById', req.params);
	Lead
	  .findById(req.params.leadId)
	  .populate('contacts')
	  .exec	(function(err, led){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }

	     //console.log(led.contacts);

	     Contact.populate(led.contacts, {
	     	path: 'contactChannels'
	     }, function(err, result){
	     	if (err) {
	          //console.log(err);
		        helper.sendJsonResponse(res, BAD_REQUEST, err);
		        return;
		    }
		    helper.sendJsonResponse(res, OK, led);
	     });
	  });
};

// PUT lead
module.exports.leadUpdate = function(req, res) {
	console.log('PUT leadUpdate', req.params.leadId);
	Lead
	  .findById(req.params.leadId)
	  .exec	(function(err, led){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }
	     if(!led){
	     	helper.sendJsonResponse(res, NOT_FOUND, {
	     		"message": "Not found lead"
	     	});
	        return;
	     }

	     led.companyName = req.body.companyName;
	     led.description = req.body.description;
	     led.url = req.body.url;

	     led.save(function(err){
	     	if (err) {
	          //console.log(err);
	        	helper.sendJsonResponse(res, BAD_REQUEST, err);
	        	return;
	     	}

	     	helper.sendJsonResponse(res, OK, led);
	     });
	  });
};