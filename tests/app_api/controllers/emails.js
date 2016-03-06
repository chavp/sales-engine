var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');
var fs = require('fs');

function loadLeadEvent(compose, cb){
	LeadEvent
		.find({
			compose: compose
		})
		.populate('riaseFrom')
		.populate('riaseTo')
		.populate('compose')
		.sort({createdAt: 'desc'})
		//.sort({createdAt: 'asc'})
		.exec(function(err, docs){

			MemberProfile.populate(docs, {
		     	path: 'riaseFrom.profile'
		     }, function(err, result){
		     	if (err) {
		          //console.log(err);
		            cb(err, result);
			        //helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			    }

			    LeadEvent.populate(docs, {
			    	path: 'compose.attachs',
					model: 'AttachFile'
			    }, function(err, results){
			    	if (err) {
			          //console.log(err);
			          	cb(err, results);
				        //helper.sendJsonResponse(res, BAD_REQUEST, err);
				        return;
				    }
				    //console.log(results[0].compose);
				    cb(err, results[0]);
				    //helper.sendJsonResponse(res, OK, results[0]);
			    });

			    //helper.sendJsonResponse(res, OK, docs[0]);
		     });

			//helper.sendJsonResponse(res, OK, docs);
			//return leads;
		});
}

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
			        	//attachs: req.body.attachs,
			        	status: req.body.status
					});

			        compose.save(function(err){
						if (err) {
				          //console.log(err);
				          helper.sendJsonResponse(res, BAD_REQUEST, err);
				          return;
				        }

				        async.eachSeries(
					     	req.body.attachs, 
					     	function iteratee(attach, done) {
					     		var attachFile = new AttachFile({
					     			compose: compose,
					     			fileName: attach.fileName,
					     			pathId: attach.pathId,
					     			fileSize: attach.fileSize
					     		});

					     		attachFile.save(function(err){
					     			done();
					     		});
					     	},
					     	function done() {
					     		loadLeadEvent(compose, function(err, result){
					     			if (err) {
							          //console.log(err);
								        helper.sendJsonResponse(res, BAD_REQUEST, err);
								        return;
								    }
								    //console.log(results[0].compose);
								    helper.sendJsonResponse(res, OK, result);
					     		});
							});
					});
				});
		});
}

// PUT updateEmail
module.exports.updateEmail = function(req, res) {
	console.log('PUT updateEmail', req.body);
	if(!req.params.composeId || req.params.composeId == 'null'){
		helper.sendJsonResponse(res, NOT_FOUND, {
			"message": "Not found compose Id"
		});
		return;
	}
	Compose
		.findById(req.params.composeId)
		.exec(function(err, compose){
			if (err) {
	          //console.log(err);
	          helper.sendJsonResponse(res, BAD_REQUEST, err);
	          return;
	        }
	        if (!compose) {
	          //console.log(err);
	          helper.sendJsonResponse(res, NOT_FOUND, {
				"message": "Not found compose"
			  });
	          return;
	        }

	        compose.to = req.body.to;
	        compose.cc = req.body.cc;
	        compose.bcc = req.body.bcc;
	        compose.subject = req.body.subject;
	        compose.content = req.body.content;
	        //compose.attachs = req.body.attachs;

	        compose.save(function(err){
	        	if (err) {
			        helper.sendJsonResponse(res, BAD_REQUEST, err);
			        return;
			    }

			    async.eachSeries(
			    	req.body.attachs,
			    	function iteratee(attach, done) {
			    		AttachFile
			    			.find({pathId: attach.pathId})
			    			.exec(function(err, attFiles){
				    				if(attFiles == null || attFiles.length == 0){
				    					var attachFile = new AttachFile({
							     			compose: compose,
							     			fileName: attach.fileName,
							     			pathId: attach.pathId,
							     			fileSize: attach.fileSize
							     		});

							     		attachFile.save(function(err){
							     			done();
							     		});

				    				} else{
				    					done();
				    				}
			    			});
			    	},
			    	function done() {
			    		loadLeadEvent(compose, function(err, result){
			     			if (err) {
					          //console.log(err);
						        helper.sendJsonResponse(res, BAD_REQUEST, err);
						        return;
						    }
						    //console.log(results[0].compose);
							helper.sendJsonResponse(res, OK, result);
						});
			    	}
			    );

	     		//helper.sendJsonResponse(res, OK, compose);
	        });
		});
}

// DELETE deleteEmail
module.exports.deleteEmail = function(req, res){
	console.log('DELETE deleteEmail', req.params);
	if (!req.params.composeId) {
	    helper.sendJsonResponse(res, BAD_REQUEST, {
	      "message": "Not found, compose Id"
	    });
	    return;
	}
	Compose
	  .findById(req.params.composeId)
	  .exec	(function(err, compose){
	    if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }
	     if(!compose){
	     	helper.sendJsonResponse(res, NOT_FOUND, {
	     		"message": "Not found compose"
	     	});
	        return;
	     }

	     compose.remove(function(err){
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

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var api_key = 'key-589de1a4626c8238a33a489934996488';
var domain = 'sandbox088039ee89e7494084c8016998ed17d2.mailgun.org';
//var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var auth = {
  auth: {
    api_key: api_key,
    domain: domain
  }
}

var dbURI = 'mongodb://localhost/saleshub';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);
var conn = mongoose.connection;

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

var uploadsFolder = "./public/tmp/";

function sendMail(compose, cb){
	var nodemailerMailgun = nodemailer.createTransport(mg(auth));
	var attachments = [];
	AttachFile
		.find({compose: compose})
		.exec(function(err, attachs){
			//var gfs = Grid(conn.db);
			var gfs = Grid(conn.db);
			async.eachSeries(
				attachs,
				function iteratee(attach, done) {
					/*attachments.push({
						filename: attach.fileName,
            			content: gfs.createReadStream({
            				_id: attach.pathId,
            				range: {
							    startPos: 0,
							    endPos: attach.fileSize
							}
            			})
					});*/
					var filepath = uploadsFolder + attach.pathId; 
					var fs_write_stream = fs.createWriteStream(filepath);
					var readstream = gfs.createReadStream({
					  _id: attach.pathId
					});
					readstream.pipe(fs_write_stream);
					fs_write_stream.on('close', function () {
					     console.log('file has been written fully!');
					     attachments.push({
					     	filename: attach.fileName,
					     	path: filepath
					     });
					     done();
					});
				},
				function done(){
					//console.log(attachments);
					var filepath = uploadsFolder + 'DS2map1_zpsa29dfc60.jpg';
					//var file = fs.readFileSync(filepath);
					//var file = attachments[0].content;
					nodemailerMailgun.sendMail({
					  from: compose.from,
					  to: compose.to, // An array if you have multiple recipients.
					  cc: compose.cc,
					  bcc: compose.bcc,
					  subject: compose.subject,
					  //'h:Reply-To': 'my.parinya@gmail.com; my.parinya@sandbox088039ee89e7494084c8016998ed17d2.mailgun.org;',
					  //You can use "html:" to send HTML email content. It's magic!
					  html: compose.content,
					  //attachment: attachments,
					  attachments: attachments
					  /*attachments: [{
					  	filename: 'DS2map1_zpsa29dfc60.jpg',
					  	content: file
					  }]*/
					  //You can use "text:" to send plain-text content. It's oldschool!
					  //text: 'From my.parinya@gmail.com to my.parinya@outlook.com!'
					}, function (err, info) {
					  if (err) {
					    //helper.sendJsonResponse(res, BAD_REQUEST, err);
					    if(cb) cb(err, info);
				    	return;
					  }
					  else {
					  	console.log(info);
					    //console.log('Response: ' + info.id);

					    compose.status = 'Send';
					    compose.save(function(err, cm){
					    	// delete all tem file
					    	if(cb) cb(err, cm);
					    	attachments.forEach(function(filename) {
							  fs.unlink(filename.path);
							});
					    });
					  }
					});
				}
			);
		});
}

// POST send mail
module.exports.sendEmail = function(req, res){
	console.log('POST sendEmail', req.params);
	if (!req.params.composeId) {
	    helper.sendJsonResponse(res, BAD_REQUEST, {
	      "message": "Not found, compose Id"
	    });
	    return;
	}

	Compose
	  .findById(req.params.composeId)
	  .exec	(function(err, compose){
	  	if (err) {
	          //console.log(err);
	        helper.sendJsonResponse(res, BAD_REQUEST, err);
	        return;
	     }
	     if(!compose){
	     	helper.sendJsonResponse(res, NOT_FOUND, {
	     		"message": "Not found compose"
	     	});
	        return;
	     }

         sendMail(compose, function(err, result){
         	if (err) {
		      helper.sendJsonResponse(res, BAD_REQUEST, err);
        	  return;
		    }
         	helper.sendJsonResponse(res, OK, result);
         });
	  });
}

// POST send mail
module.exports.sendNewEmail = function(req, res){
	console.log('POST sendNewEmail', req.params);
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
			        	//attachs: req.body.attachs,
			        	status: 'Send'
					});

			        compose.save(function(err){
						if (err) {
				          //console.log(err);
				          helper.sendJsonResponse(res, BAD_REQUEST, err);
				          return;
				        }

				        async.eachSeries(
					     	req.body.attachs, 
					     	function iteratee(attach, done) {
					     		var attachFile = new AttachFile({
					     			compose: compose,
					     			fileName: attach.fileName,
					     			pathId: attach.pathId,
					     			fileSize: attach.fileSize
					     		});

					     		attachFile.save(function(err){
					     			done();
					     		});
					     	},
					     	function done() {
					     		loadLeadEvent(compose, function(err, result){
					     			if (err) {
							          //console.log(err);
								        helper.sendJsonResponse(res, BAD_REQUEST, err);
								        return;
								    }
								    //console.log(results[0].compose);
								    //helper.sendJsonResponse(res, OK, result);

								    sendMail(compose, function(err, resp){
							           if (err) {
									     helper.sendJsonResponse(res, BAD_REQUEST, err);
							        	 return;
									   }
							           //helper.sendJsonResponse(res, OK, docs[0]);
							           helper.sendJsonResponse(res, OK, result);
									});
					     		});
							});

						/*LeadEvent
								.find({
									compose: compose
								})
								.populate('riaseFrom')
								.populate('riaseTo')
								.populate('compose')
								.sort({createdAt: 'desc'})
								//.sort({createdAt: 'asc'})
								.exec(function(err, docs){

									MemberProfile.populate(docs, {
								     	path: 'riaseFrom.profile'
								     }, function(err, result){
								     	if (err) {
								          //console.log(err);
									        helper.sendJsonResponse(res, BAD_REQUEST, err);
									        return;
									    }
									    //helper.sendJsonResponse(res, OK, docs[0]);

									    // send email
									    sendMail(compose, function(err, result){
								           if (err) {
										     helper.sendJsonResponse(res, BAD_REQUEST, err);
								        	 return;
										   }
								           helper.sendJsonResponse(res, OK, docs[0]);
								        });
								     });

									//helper.sendJsonResponse(res, OK, docs);
									//return leads;
								});*/
					});
			   });
		});
}