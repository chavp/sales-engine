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

// POST lead save contact
module.exports.leadSaveContact = function(req, res) {
	console.log('POST leadSaveContact', req.params.leadId);
	if(!req.params.leadId || req.params.leadId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id."
		});
		return;
	}
	if(!req.params.leadId || req.params.leadId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found lead Id."
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
	     		"message": "Not found lead."
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

			     async.eachSeries(
			     	req.body.contactChannels, 
			     	function iteratee(item, done) {
			     		var name = item.name,
			     	    type = item.type;
				     	if(name){
					     	var contactChannel = new ContactChannel({
					     		name: name,
					     		type: type,
					     		contact: con
					     	});
					     	contactChannel.save(function(err){
					     		done();
					     	});
				     	} else {
				     		done();
				     	}
			     	}, 
			     	function done() {
						Contact
						  .findById(con._id)
						  .populate('contactChannels')
						  .exec	(function(err, con){
						  	 helper.sendJsonResponse(res, OK, con);
						  });
					});

			     /*for (var i = 0; i < req.body.contactChannels.length; i++) {
			     	var name = req.body.contactChannels[i].name,
			     	    type = req.body.contactChannels[i].type;
			     	if(name){
				     	var contactChannel = new ContactChannel({
				     		name: name,
				     		type: type,
				     		contact: con
				     	});
				     	contactChannel.save();
			     	}
			     };

			     helper.sendJsonResponse(res, OK, con);*/
			});
	  });
};

// PUT lead save contact
module.exports.leadUpdateContact = function(req, res) {
	console.log('PUT leadUpdateContact', req.params);
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
	     		if (err) {
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			    }

			    // https://github.com/caolan/async
			    async.eachSeries(req.body.contactChannels, function iteratee(item, callback) {
			    	if(item._id){
					    ContactChannel
		     				.findById(item._id)
		     				.exec(function(err, conChannel){
		     					if(item.name){
		     						conChannel.name = item.name;
		     						conChannel.type = item.type;
		     						conChannel.save(function(err){
		     							callback();
		     						});
		     					} else {
		     						conChannel.remove(function(err){
		     							callback();
		     						});
		     					}
		     				});
	     			} else {
	     				if(item.name){ // new contact
					     	var contactChannel = new ContactChannel({
					     		name: item.name,
					     		type: item.type,
					     		contact: con
					     	});
					     	contactChannel.save(function(err){
								callback();
							});
				     	} else {
				     		callback();
				     	}
	     			}
				}, function done() {
					Contact
					  .findById(req.params.contactId)
					  .populate('contactChannels')
					  .exec	(function(err, con){
					  	 helper.sendJsonResponse(res, OK, con);
					  });
				});

			    /*for (var i = 0; i < req.body.contactChannels.length; i++) {
			     	//console.log(req.body.contactChannels[i]);
			     	if(req.body.contactChannels[i]._id){// update contact channel
			     		ContactChannel
			     				.findById(req.body.contactChannels[i]._id)
			     				.exec(function(err, conChannel){
			     					if(req.body.contactChannels[i].name){
			     						conChannel.name = req.body.contactChannels[i].name;
			     						conChannel.type = req.body.contactChannels[i].type;
			     						conChannel.save();
			     					} else {
			     						conChannel.remove();
			     					}
			     				});
			     	} else {
			     		if(req.body.contactChannels[i].name){ // new contact
					     	var contactChannel = new ContactChannel({
					     		name: req.body.contactChannels[i].name,
					     		type: req.body.contactChannels[i].type,
					     		contact: con
					     	});
					     	contactChannel.save();
				     	} 
			     	}
			    };

			    helper.sendJsonResponse(res, OK, con);*/
			 });
	  });
};

// DELETE lead contacts
module.exports.leadDeleteContact = function(req, res) {
	console.log('DELETE leadDeleteContact', req.params);
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
		.findById({_id: req.params.contactId})
		.exec(function(err, con){
			if (err) {
	          //console.log(err);
		        helper.sendJsonResponse(res, BAD_REQUEST, err);
		        return;
		     }

		     con.remove(function(err){
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
};