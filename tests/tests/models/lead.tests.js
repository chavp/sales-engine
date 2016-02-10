var utils = require('./utils');

 describe("Leads", function () {

 	it("create simple lead", function(done){

 		var leader = new Lead({
 			organizationName: 'new-org',
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

 		/// Organization add lead
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

    
 });