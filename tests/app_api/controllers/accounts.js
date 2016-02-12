var mongoose = require('mongoose');
var passport = require('passport');
var helper = require('./helper');

//console.log(helper.sendJsonResponse);

/* POST login */
module.exports.login = function(req, res) {
  console.log('Login', req.body);
  if (!req.body.username) {
    helper.sendJsonResponse(res, NOT_FOUND, {
      "message": "Not found, email address is required"
    });
    return;
  }
  if (!req.body.password) {
    helper.sendJsonResponse(res, NOT_FOUND, {
      "message": "Not found, password is required"
    });
    return;
  }
  /*Member
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
      });*/

  passport.authenticate('local', function(err, user, info){
    var token;

    if (err) {
      helper.sendJsonResponse(res, 404, err);
      return;
    }
    //console.log(user);

    if(user){
      token = user.generateJwt();
      helper.sendJsonResponse(res, 200, {
        "token" : token
      });
    } else {
      helper.sendJsonResponse(res, 401, info);
    }
  })(req, res);
};

/* POST signup */
module.exports.signup = function(req, res) {
	console.log('Signup', req.body);
	// check username (User with this email address already exists.)

	// create member
	// create profile
	// create organization

	helper.sendJsonResponse(res, OK, {
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
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!member) {
          helper.sendJsonResponse(res, NOT_FOUND, {
            "message": "This email address is not registered."
          });
          return;
        }

        // reset password

        helper.sendJsonResponse(res, OK, {
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
      .populate('liveOrganization')
      .populate('organizations')
      .exec(function(err, member) {
      	if (err) {
          //console.log(err);
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if (!member) {
          helper.sendJsonResponse(res, NOT_FOUND, {
            "message": "Invalid member."
          });
          return;
        } 

        // set avtive org
        if(member.organizations.length == 1){
            member.liveOrganization = member.organizations[0];
            member.save();
        }

        //console.log(member);
        var result = {
          _id: member._id,
          username: member.username,
          createdAt: member.createdAt,
          email: member.email,
          updatedAt: member.updatedAt,
          profile: member.profile,
          organizations: member.organizations,
          liveOrganization: member.liveOrganization
        };
        helper.sendJsonResponse(res, OK, result);
      });
}

/* GET account */
module.exports.accounts = function(req, res) {
  console.log('Get account', req.params);
  console.log('Get account', req.query);

  Member
      .find({})
      .exec(function(err, members) {
        if (err) {
          console.log(err);
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        var memberList = members.map(function(m){
            return {
                _id: m._id,
                userName: m.userName,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt
            };
        });
        console.log(memberList);
        helper.sendJsonResponse(res, OK, memberList);
      });
}

/* PUT update account */
module.exports.accountUpdate = function(req, res) {
  console.log('Update account', req.body);
  if (!req.body.userName) {
    helper.sendJsonResponse(res, NOT_FOUND, {
      "message": "Not found, user name is required"
    });
    return;
  }
  Member
      .findById(req.params.memberId)
      .exec(function(err, member) {
        if (err) {
          //console.log(err);
          helper.sendJsonResponse(res, BAD_REQUEST, err);
          return;
        }
        if(!member){
          helper.sendJsonResponse(res, NOT_FOUND, {
            "message": "This member not registered."
          });
          return;
        }
        member.userName = req.body.userName;
        member.save(function(err){
          if (err) {
            //console.log(err);
            helper.sendJsonResponse(res, BAD_REQUEST, err);
            return;
          }

          helper.sendJsonResponse(res, OK, {
            "message": "Update account successful."
          });

        });
      });
};

/* PUT save profile */
module.exports.saveProfile = function(req, res) {
	console.log('Save profile', req.body);
	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT change email address */
module.exports.changeEmail = function(req, res) {
	console.log('Change email address', req.body);
	// check current password (Password is incorrect)

	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* PUT change password */
module.exports.changePassword = function(req, res) {
	console.log('Change password', req.body);
	// check old password (Password is incorrect)
	// change password (Passwords must match.)

	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};

/* POST logout */
module.exports.logout = function(req, res) {
	console.log('Logout', req.body);
	// check old password (Password is incorrect)
	// change password (Passwords must match.)

	helper.sendJsonResponse(res, OK, {
		"message": NOT_IMPLEMENTS
	});
};
