var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};

var renderMembers = function(req, res, data){
  res.render('members', {
    title: "Member list",
    members: data.members
  });
}

var renderMemberDetail = function(req, res, data){
  res.render('members-detail', {
    title: "Member",
    _id: data._id,
    userName: data.userName,
    password: data.password,
    message: data.message,
    updatedAt: data.updatedAt
  });
}

/* GET 'Login' page */
module.exports.login = function(req, res){
  res.render('login', {
    title: "Login"
  });
};

/* GET 'Member list' page */
module.exports.members = function(req, res){
  var requestOptions, path;
  path = "/api/accounts";
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs: {
    	start: 0,
    	limit: 100
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 200) {
      	var data = {
      		members: []
      	};
      	data.members = body;
        renderMembers(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/* GET 'Member read one' page */
module.exports.membersReadOne = function(req, res){
  var requestOptions, path;
  path = "/api/accounts/" + req.params.memberId;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 200) {
      	var data = {
      		_id: body._id,
      		userName: body.userName,
      		password: body.password
      	};
        renderMemberDetail(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/* POST 'Update member ' page */
module.exports.updateMember = function(req, res){
  if (!req.body.userName) {
    _showError(req, res, 400);
    return;
  }
  var requestOptions, path;
  path = "/api/accounts/" + req.params.memberId;
  requestOptions = {
    url : apiOptions.server + path,
    method : "PUT",
    json:{
      userName: req.body.userName
    }
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 200) {
      	requestOptions.method = "GET";
      	request(
  		    requestOptions,
  		    function(err, response, body) {
  		      if (response.statusCode === 200) {
  		      	var data = {
  		      		_id: body._id,
  		      		userName: body.userName,
  		      		password: body.password,
                updatedAt: body.updatedAt,
                message: "Saved!"
  		      	};
  		        renderMemberDetail(req, res, data);
  		      } else {
  		        _showError(req, res, response.statusCode);
  		      }
  		    }
		    );
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};