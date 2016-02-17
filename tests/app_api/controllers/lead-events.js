var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');

// GET events
module.exports.leadEvents = function(req, res) {
	console.log('GET leadEvents', req.params);
	LeadEvent
		.find({
			lead: req.params.leadId
		})
		.populate('riaseFrom')
		.populate('riaseTo')
		.sort({createdAt: 'desc'})
		//.sort({createdAt: 'asc'})
		.exec(function(err, docs){
			helper.sendJsonResponse(res, OK, docs);
			//return leads;
		});
}

// POST create lead events
module.exports.leadEventsDone = function(req, res) {
	console.log('GET leadEventsDone', req.params);
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

	     Member
	     	.findById(req.body.memberId)
	     	.exec(function(err, mem){
	     		if (err) {
	          	//console.log(err);
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			    }
			    if(!mem){
			     	helper.sendJsonResponse(res, NOT_FOUND, {
			     		"message": "Not found member."
			     	});
			        return;
			     }

			    if(req.body.type == 'Note'){
					var leadEvent = new LeadEvent({
						title: req.body.title,
						content: req.body.content,
						type: req.body.type,
						riaseFrom: mem,
						lead: led
					});

					leadEvent.save(function(err, lv){
						if (err) {
			          	//console.log(err);
					        helper.sendJsonResponse(res, BAD_REQUEST, err);
					        return;
					    }
					    helper.sendJsonResponse(res, OK, lv);
					});

				} else {
				   sendJsonResponse(res, OK, { "message": NOT_IMPLEMENTS });
				}
	     	});
	   });
}