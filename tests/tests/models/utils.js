require('dotenv').load();
mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/saleshub';

// BRING IN YOUR SCHEMAS & MODELS
require('../../app_api/models/dbs');

should = require('chai').should();

function clearDB(done) {
	for (var i in mongoose.connection.collections) {
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