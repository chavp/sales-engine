var mongoose = require('mongoose');
var helper = require('./helper');

// GET all leads
module.exports.leads = function(req, res) {
	//console.log('Leads', req.params);
	Lead
		.find({})
		.sort({createdAt: 'desc'})
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
		.sort({createdAt: 'desc'})
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
      });
};

// POST create lead
module.exports.leadSave = function(req, res) {
	console.log('Save lead', req.body);
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
	console.log('Get lead', req.params);
	Lead
	  .findById(req.params.leadId)
	  .populate('contacts')
	  .exec	(function(err, led){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }

	     helper.sendJsonResponse(res, OK, led);
	  });
};

module.exports.leadUpdate = function(req, res) {
	console.log('Update lead', req.params.leadId);
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

// POST lead save contact
module.exports.leadSaveContact = function(req, res) {
	console.log('Update lead save contact', req.params.leadId);
	if(!req.params.leadId || req.params.leadId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id"
		});
		return;
	}
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

	     Contact
	     	.create({
	     		name: req.body.name,
	     		title: req.body.title,
	     		lead: led
	     	}, function(err, con){
	     		if (err) {;
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			     }
			     helper.sendJsonResponse(res, OK, con);
			 });
	  });
};

// PUT lead save contact
module.exports.leadUpdateContact = function(req, res) {
	console.log('Update lead save contact', req.params);
	if(!req.params.leadId || req.params.leadId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id"
		});
		return;
	}
	if(!req.params.contactId || req.params.contactId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found contact Id"
		});
		return;
	}
	Contact
	  .findById(req.params.contactId)
	  .exec	(function(err, con){
	     if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }
	     if(!con){
	     	helper.sendJsonResponse(res, NOT_FOUND, {
	     		"message": "Not found contact"
	     	});
	        return;
	     }
	     con.name = req.body.name;
	     con.title = req.body.title;
	     con
	     	.save(function(err, con){
	     		if (err) {;
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			     }
			     helper.sendJsonResponse(res, OK, con);
			 });
	  });
};