var mongoose = require('mongoose');
var async    = require('async');
var helper = require('./helper');
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');

var uploadsFolder = "./public/tmp/";

// POST upload file
module.exports.upload = function(req, res) {
	 //console.log(req.body, req.files);
	  var file = req.files.file;
	  //console.log("file name", file.name);                                           
      //console.log("file path", file.path); 
      mkdirp(uploadsFolder, function(err) {
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
	  }); 
      
}

module.exports.delete = function(req, res) {
	
}