var should = require('chai').should();
var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};

describe("Accounts API", function () {
	var loginPath = apiOptions.server + "/api/accounts/login";
	it("valid Login", function(done){
		request(
		    {
		      url : loginPath,
			  method : "POST",
			  json : {
			  	 username: "ding2@saleshub.com",
			  	 password: "123456789"
			  }
		    },
		    function(err, response, body) {
		      //console.log(body);
		      try{
		      	 response.statusCode.should.equal(200);
		      	 should.exist(body.token);
		      	 done();
		      }catch(err){
		      	 return done(err);
		      }
		    }
	    );
	});

	it("invalid Login", function(done){
		request(
		    {
		      url : loginPath,
			  method : "POST",
			  json : {
			  	 username: "ding2@saleshub.com",
			  	 password: "123456789454"
			  }
		    },
		    function(err, response, body) {
		      //console.log(body);
		      try{
		      	var message = body.message;
		      	 response.statusCode.should.equal(401);
		      	 message.should.equal("Invalid email address or password.");
		      	 done();
		      }catch(err){
		      	 done(err);
		      }
		    }
	    );
	});


});