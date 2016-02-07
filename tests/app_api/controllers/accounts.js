var mongoose = require('mongoose');

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST login */
module.exports.login = function(req, res) {
  console.log('Login', req.body);
  if (!req.body.userName) {
    sendJsonResponse(res, NOT_FOUND, {
      "message": "Not found, email address is required"
    });
    return;
  }
  if (!req.body.password) {
    sendJsonResponse(res, NOT_FOUND, {
      "message": "Not found, password is required"
    });
    return;
  }
  Member
      .findOneByUserName( req.body.userName )
      .exec(function(err, member) {
      	if (err) {
          console.log(err);
          sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!member) {
          sendJsonResponse(res, NOT_FOUND, {
            "message": "Invalid email address or password."
          });
          return;
        } 
        if(!member.login(req.body.password)){
          sendJsonResponse(res, NOT_FOUND, {
            "message": "Invalid email address password."
          });
          return;
        }
        console.log(member);
        sendJsonResponse(res, OK, member);
      });
};

/* POST signup */
module.exports.signup = function(req, res) {
	console.log('Signup', req.body);
	// check username (User with this email address already exists.)

	// create member
	// create profile
	// create organization

	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT reset password */
module.exports.resetPassword = function(req, res) {
	console.log('Reset password', req.body);
	// check username (This email address is not registered.)
	Member
      .findOneByUserName( req.body.userName )
      .exec(function(err, member) {
      	if (err) {
          console.log(err);
          sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!member) {
          sendJsonResponse(res, NOT_FOUND, {
            "message": "This email address is not registered."
          });
          return;
        }

        // reset password

        sendJsonResponse(res, OK, {
			   "message": NOT_IMPLEMENTS
		    });
      });
};

/* GET account */
module.exports.accountReadOne = function(req, res) {
	console.log('Get account', req.params);

	Member
      .findById( req.params.memberId )
      .populate('profile')
      .populate('organizations')
      .exec(function(err, member) {
      	if (err) {
          console.log(err);
          sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!member) {
          sendJsonResponse(res, NOT_FOUND, {
            "message": "Invalid member."
          });
          return;
        } 
        console.log(member);
        sendJsonResponse(res, OK, member);
      });
}


/* PUT save profile */
module.exports.saveProfile = function(req, res) {
	console.log('Save profile', req.body);
	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT change email address */
module.exports.changeEmail = function(req, res) {
	console.log('Change email address', req.body);
	// check current password (Password is incorrect)

	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT change password */
module.exports.changePassword = function(req, res) {
	console.log('Change password', req.body);
	// check old password (Password is incorrect)
	// change password (Passwords must match.)

	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* POST logout */
module.exports.logout = function(req, res) {
	console.log('Logout', req.body);
	// check old password (Password is incorrect)
	// change password (Passwords must match.)

	sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};
