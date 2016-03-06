var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');

var uploadsFolder = "./public/tmp/";
var dbURI = 'mongodb://localhost/saleshub';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);
var conn = mongoose.connection;

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

// POST upload file
module.exports.upload = function(req, res) {
	  //console.log("composeId: " + req.body.composeId);
	  
	  var file = req.files.file;
	  //console.log("file name", file.name);                                           
      //console.log("file path", file.path); 
      /*mkdirp(uploadsFolder, function(err) {
      	if(err)  {
      		helper.sendJsonResponse(res, INTERNAL_SERVER_ERROR, err);
	        return;
      	}
      	var temporal_path = file.path;
	    var input_stream = fs.createReadStream(temporal_path);
	    var output_stream = fs.createWriteStream(uploadsFolder + file.name);
	    input_stream.pipe(output_stream);
	    input_stream.on('end',function(err) {
	  	  fs.unlinkSync(temporal_path);
	  	  helper.sendJsonResponse(res, OK, {
		   "message": "Upload files completed!"
	  	  });
	    });
	  });*/
	  var temporal_path = file.path;
	  var gfs = Grid(conn.db);
	  var writestream = gfs.createWriteStream({
		    filename: file.name
	  });
	  fs.createReadStream(temporal_path).pipe(writestream);
	 
	  writestream.on('close', function (file) {
	        // do something with `file`
	      console.log('Written To DB: ' + file);

	      // create attach file auto
	      if(req.body.composeId){
	      	Compose
	      		.findById(req.body.composeId)
	      		.exec(function(err, com){
	      			if (err) {
					  helper.sendJsonResponse(res, INTERNAL_SERVER_ERROR, err);
					  return;
					}
					if(!com){
						helper.sendJsonResponse(res, BAD_REQUEST, {
					      "message": "Not found, compose."
					    });
					    return;
					}

					var attachFile = new AttachFile({
		     			compose: com,
		     			fileName: file.filename,
		     			pathId: file._id,
		     			fileSize: file.length
		     		});

		     		attachFile.save(function(err){
		     			helper.sendJsonResponse(res, OK, {
							 "message": "Upload files and attach to compose completed!",
							 "attachFileId": attachFile._id,
							 "pathId": file._id,
							 "length": file.length,
							 "filename": file.filename
					  });
		     		});
	      		});
	      } else {
		      helper.sendJsonResponse(res, OK, {
				 "message": "Upload files completed!",
				 "pathId": file._id,
				 "length": file.length,
				 "filename": file.filename
			  });
	  	  }
	  });
}

// DELETE file
module.exports.delete = function(req, res) {
	console.log("DELETE file " + req);
	var gfs = Grid(conn.db);
	gfs.remove({
		_id : req.params.pathId
	}, function (err) {
	  if (err) {
	  	helper.sendJsonResponse(res, INTERNAL_SERVER_ERROR, err);
	  	return;
	  }
	  if(req.body.attachFileId){
	  	AttachFile
	  		.findById(req.body.attachFileId)
	  		.exec(function(err, attFile){
	  			if (err) {
				  helper.sendJsonResponse(res, INTERNAL_SERVER_ERROR, err);
				  return;
				}

				attFile.remove(function(err){
					if (err) {
					  helper.sendJsonResponse(res, INTERNAL_SERVER_ERROR, err);
					  return;
					}

					helper.sendJsonResponse(res, OK, {
					   "message": "Delete files and attach completed!"
				  	});
				});
	  		});
	  }
	  else {
	  	helper.sendJsonResponse(res, OK, {
		   "message": "Delete files completed!"
	  	});
	  }
	});
}