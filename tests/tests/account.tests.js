var utils = require('./utils');

/////////////////////////////////////////////////////////////////////////////
describe("Member", function () {
	var memberName = "ding";

	it("add ding password 123456789", function(done){
		var ding = new Member({
			email: memberName + "@saleshub.com",
			username: memberName,
			password: "123456789"
		});
		ding.save(function(err){
			Member.count({username: memberName}, function(err, c){
				c.should.be.equal(1);
				done();
			});
		});
		//done();
	});

	it("check ding dupplicate member", function(done){
		Member.create({username: memberName}, function(err){
			should.exist(err);
			done();
		});
	});

	it("check ding valid password", function(done){
		Member.findOne({username: memberName}, function(err, member){
			var valid = member.validPassword("123456789");
			//console.log(valid);
			valid.should.equal(true);
			done();
		});
	});

	it("check ding invalid password", function(done){
		Member.findOne({username: memberName}, function(err, member){
			var valid = member.validPassword("999999999");
			//console.log(valid);
			valid.should.equal(false);
			done();
		});
	});
});

/////////////////////////////////////////////////////////////////////////////
describe("Member with profile", function () {
	it("add ding with profile", function(done){
		var memberName = "ding2";

		var ding = new Member({
			email: memberName + "@saleshub.com",
			username: memberName,
			password: "123456789"
		});

		ding.save(function(err){
			if(!err){
				var dingProfile = new MemberProfile({
					firstName: "Parinya",
					lastName: "Chavp",
					phone: "0812598962",
					member: ding
				});

				dingProfile.save(function(err){
					Member
					 .findOne({username: memberName})
					 .populate('profile')
					 .exec(function(err, member){
						//console.log(member.profile);
						should.exist(member.profile);
						done();
					});
				});
			}else{
				console.log(err);
				done();
			}
		});

		//done();
	});
});

/////////////////////////////////////////////////////////////////////////////
describe("Organization with members", function () {
	it("add the-home org with all members", function(done){
		var theHome = new Organization({
			name: "The-Home"
		});
		//theHome.save();

		Member.find({}, function(err, members){
			//console.log(members);

			members.forEach(function(member){
				theHome.members.push(member);
				//member.save();
			});
		});

        theHome.save(function(err){
        	Member.find({}, function(err, members){
				//console.log(members.length);
				members.length.should.equal(2);
				
				//theHome.members.push(members);

				Organization
				 .findOneByName("The-Home")
				 //.populate('members')
				 .exec(function(err, org){
					//console.log(org.members);
					try{
						org.members.length.should.equal(2);
						done();
					}catch (err){
					  return done(err);
					}
				});
			});
        });
	});

	var memberName = "ding2";
	it("check member $ profile $ org relationship", function(done){
		Member
		 .findOne({username: memberName}, function(err, member){
			should.exist(member.profile);
			try{
				member.organizations.forEach(function(org){
					try{
						should.exist(org);
					}catch(err){
						throw err;
					}
				});
				done();
			}catch(err){
				done(err);
			}
		  })
		  .populate('profile')
		  .populate('organizations');
	});
});

/////////////////////////////////////////////////////////////////////////////
