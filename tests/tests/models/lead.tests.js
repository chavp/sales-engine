var utils = require('./utils');

 describe("Leads", function () {

 	it("create simple lead", function(done){

 		var leader = new Lead({
 			companyName: 'new-org',
 			description: 'new-desc',
 			url: 'http://5555.org'
 		});

 		leader.save(function(err){
 			try{
 				//Lead.fin
 				//done();
 			}catch(err){
 				done(err);
 			}
 		});
 		leader.description = "update-desc";
 		leader.save();

 		Lead
 		  .findOne({description: "update-desc"})
 		  .exec(function(err, lead){
 		  	  try{
 				//Lead.fin
 				  lead.description.should.equal("update-desc");
 				  //done();
	 			}catch(err){
	 				//done(err);
	 			}
 		  	  //console.log(lead);
 		  });

 		// Organization add lead
 		Organization.findOneByName("The-Home", function(err, org){
					//console.log(org);
			try{
				//org.leads.push(leader);
				//org.save();
				Lead.create({
					organization: org
				}, function(err, lead){
		 		  	  try{
		 				  done();
			 			}catch(err){
			 				done(err);
			 			}
		 		  	  //console.log(lead);
		 		  });
				
				//console.log(org.leads);
				//done();
			}catch (err){
			  done(err);
			}
		});
 	});

    it("new lead with company name", function(done){

    	Member
    		.findOneByUsername("my.parinya@gmail.com")
    		.populate('organizations')
    		.exec(function(err, mem){
    			if(err) return done(err);

    			var firstOrg = mem.organizations[0];

    			Lead.create({
	 				companyName: "TheHome-new Lead",
	 				organization: firstOrg,
	 				createdBy: mem
	 			}, function(err, lead){
	 				if(err) return done(err);

	 				Organization
	 					.findById(firstOrg._id)
	 					.exec(function(err, x){
	 						try{
	 							expect('' + x.leads[1]).to.equal('' + lead._id);
			 					//x.leads[1].should.equal(lead._id);
			 					Member
			 						.findById(mem._id)
			 						//.populate('leads')
			 						.exec(function(err, x){
			 							if(err) return done(err);

			 							try{
			 								//console.log(x.leads);
			 								expect('' + x.leads[0]).to.equal('' + lead._id);
											done();
			 							}catch (err){
										  return done(err);
										}
			 						});
			 				//console.log(org);
			 				}catch (err){
							  return done(err);
							}
	 					});
	 			});
    		});
    });
 });