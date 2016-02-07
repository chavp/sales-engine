var utils = require('./utils');

 describe("Organization add Admin Role", function () {
 	it("add Chavp org", function(done){
 		var chavpMember = new Member({
 			userName: 'my-chavp',
 			password: '5647888'
 		});

 		chavpMember.save();

 		var chavp2Member = new Member({
 			userName: 'my-chavp-2',
 			password: '5647888'
 		});

 		chavp2Member.save();

 		var chavpOrg = new Organization({
 			name: 'org-chavp'
 		});

 		chavpOrg.members.push(chavpMember);
 		chavpOrg.save();

 		var organizationRole = new OrganizationRole({
 			member: chavpMember,
 			organization: chavpOrg,
 			role: 'user'
 		});

 		organizationRole.save();

 		organizationRole = new OrganizationRole({
 			member: chavp2Member,
 			organization: chavpOrg,
 			role: 'admin'
 		});

 		organizationRole.save();

 		// Assert
 		OrganizationRole.find({}, function(err, orgRoles){
 			try {
			  orgRoles.length.should.equal(2);
			  done();
			} catch (err){
			  return done(err);
			}
 		});

 		//done();
 	});
 });