var utils = require('./utils');

 describe("Organization add Admin Organization Role", function () {
 	it("add Chavp org", function(done){
 		var chavpMember = new Member({
 			email: "my-chavp@saleshub.com",
 			username: 'my-chavp',
 			password: '5647888'
 		});

 		chavpMember.save(function(err){
 			if(err) return done(err);

 			//console.log('1-save chavpMember');

 			var chavp2Member = new Member({
	 			email: "my-chavp-2@saleshub.com",
	 			username: 'my-chavp-2',
	 			password: '5647888'
	 		});

	 		chavp2Member.save(function(err){
	 			if(err) return done(err);

	 			//console.log('2-save chavp2Member');

	 			var chavpOrg = new Organization({
		 			name: 'org-chavp'
		 		});

		 		chavpOrg.members.push(chavpMember);
		 		chavpOrg.save(function(err){
		 			if(err) return done(err);
		 			//console.log('3-save chavpOrg');

			 		var organizationRole = new OrganizationRole({
			 			member: chavpMember,
			 			organization: chavpOrg,
			 			role: 'user'
			 		});

			 		organizationRole.save(function(err){
						if(err) return done(err);
						//console.log('4-save organizationRole');

						// Assert
				 		OrganizationRole
				 			.find({})
				 			.exec(function(err, orgRoles){
				 				//console.log('5-save organizationRole');
					 			try {
								  orgRoles.length.should.equal(1);
								  done();
								} catch (err){
								  done(err);
								}
				 			}); // OrganizationRole.find
			 		}); // organizationRole.save

		 		}); // chavpOrg.save
	 		}); // chavp2Member.save
 		}); // chavpMember.save
 	});
 });