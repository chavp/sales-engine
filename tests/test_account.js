require('./app_api/models/db');

var mongoose = require('mongoose');

var Member = mongoose.model('Member'),
    MemberProfile = mongoose.model('MemberProfile');

//////////// Memeber
/*
var ding = new Member({
	userName: "Ding",
	password: "9999999"
});

var dingProfile = new MemberProfile({
	firstName: "Parinya",
	lastName: "Chavp",
	phone: "0812598962",
	email: "my.parinya@gmail.com",
	memberId: ding._id
});

ding.save(function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Create ding successfull!");
	}
});

ding.save();
dingProfile.save();
*/

/////////// Test Password
/*Member.findOne({userName: "Ding"}, function(err, member){
	//console.log(member.userName);
    console.log("Password123 = " + member.isValid('Password123'));
    console.log("9999999 = " + member.isValid('9999999'));

    console.log(member.profileId);
});*/


/*Member.remove(oldDing, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Remove member successfull!");
	}
});
*/
// test a matching password