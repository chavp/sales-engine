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
		.populate('tags')
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
			.populate('tags')
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

	        var newLead = new Lead({
	        		companyName: req.body.companyName || req.body.contactName,
	 				organization: mem.liveOrganization,
	 				createdBy: mem
	        	});

	        newLead.save(function(err){
        		if (err) {
		          //console.log(err);
		          helper.sendJsonResponse(res, BAD_REQUEST, err);
		          return;
		        }

		        if(req.body.contactName){
		        	var newContact = new Contact({
		        		name: req.body.contactName,
		        		lead: newLead
		        	});

		        	newContact.save(function(err){
		        		helper.sendJsonResponse(res, OK, 
							{ "message": "Save lead completed." }
						);
		        	});

		        } else {
			        helper.sendJsonResponse(res, OK, 
						{ "message": "Save lead completed." }
					);
		    	}
        	});

	        /*Lead
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
	        	});*/
		});
};

// GET get by ID
module.exports.leadById = function(req, res) {
	console.log('GET leadById', req.params);
	Lead
	  .findById(req.params.leadId)
	  .populate('contacts')
	  .populate('tags')
	  .exec	(function(err, led){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }

	     //console.log(led.contacts);
	     if(led){
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
	 	 } else {
	 	 	helper.sendJsonResponse(res, NOT_FOUND, {
	 	 		"message": "Lead not found." 
	 	 	});
	 	 }
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
	     led.address = req.body.address;
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

// DELETE lead
module.exports.leadDelete = function(req, res){
	console.log('DELETE leadDelete', req.params);
	if (!req.params.leadId) {
	    helper.sendJsonResponse(res, BAD_REQUEST, {
	      "message": "Not found, lead Id is required"
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

	     led.remove(function(err){
	     	if (err) {
	          //console.log(err);
	        	helper.sendJsonResponse(res, BAD_REQUEST, err);
	        	return;
	     	}

	     	helper.sendJsonResponse(res, OK, {
	     		"message": "Delete completed."
	     	});
	     });
	  });
}

// POST save tags
module.exports.leadSaveTags = function(req, res){
	console.log('POST leadSaveTags', req.params);
	if (!req.params.leadId) {
	    helper.sendJsonResponse(res, BAD_REQUEST, {
	      "message": "Not found, lead Id is required"
	    });
	    return;
	}

	Lead
	  .findById(req.params.leadId)
	  .populate('tags')
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

	     if(req.body.tags == null || req.body.tags.length == 0){
	     	helper.sendJsonResponse(res, OK, led);
	        return;
	     }

	     //console.log("tags: " + led.tags);

	     var newTags = req.body.tags;
	     var oldTags = led.tags.map(function(d){ return d.tag; });
	     var saveTags = [],
	     	 haveNewTags = [];

	     console.log(newTags);

	     if(newTags && newTags.length > 0){
	      	for (var i = 0; i < newTags.length; i++) {
	      		//var tag = newTags[i].tag;
	      		if (!oldTags.contains(newTags[i].tag)) {
	     		   if(!haveNewTags.contains(newTags[i].tag)){
				   	   saveTags.push({
				   	   		tag: newTags[i].tag,
				   	   		type: newTags[i].type
				   	   });
				   	   haveNewTags.push(newTags[i].tag);
				   }
				}
	      	}

	     	//console.log("saveTags: " + saveTags);
	     	/*led.tags.forEach(function(tag) {
		     		for (var i = 0; i < newTags.length; i++) {
					var newTag = newTags[i];
					if(tag != newTag){
						saveTags.push(newTag);
					}
				}
	     	});*/
	     	
	     	async.eachSeries(
		     	saveTags, 
		     	function iteratee(tag, done) {
		     		var leadTag = new LeadTag({
				     	tag: tag.tag,
				     	type: tag.type,
				     	lead: led
					});
					leadTag.save(function(err){
				     	done();
					});
		     	}, 
		     	function done() {
					Lead
					  .findById(req.params.leadId)
					  .populate('tags')
					  .exec	(function(err, lead){
					  	 helper.sendJsonResponse(res, OK, lead);
					  });
				});
	     }

	  });

}