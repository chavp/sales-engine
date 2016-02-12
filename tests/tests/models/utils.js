require('dotenv').load();
mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/saleshub';

// BRING IN YOUR SCHEMAS & MODELS
require('../../app_api/models/dbs');

should = require('chai').should();
expect = require('chai').expect;

function clearDB(done) {
	for (var i in mongoose.connection.collections) {
		//console.log(mongoose.connection.collections[i].name);
		var collection_name = mongoose.connection.collections[i].name;
		if(collection_name === 'contacttypes' || 
		   collection_name === 'defaultleadstatuses' ||
		   collection_name === 'defaultopportunitystatuses'||
		   collection_name === 'choices'||
		   collection_name === 'questions') continue;
		mongoose.connection.collections[i].remove(function() {});
	}
	return done();
}

before(function(done) {
	if (mongoose.connection.readyState === 0) {
	    mongoose.connect(dbURI, function (err) {
	      if (err) {
	        throw err;
	      }
	      return clearDB(done);
	    });
	  } else {
	    return clearDB(done);
	}
});

after(function (done) {
  /*for (var i in mongoose.connection.collections) {
	mongoose.connection.collections[i].remove(function() {});
  }*/
  mongoose.disconnect();
  return done();
});