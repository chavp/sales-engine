(function () {
	angular
    	.module('salesHubApp')
    	.service('leads', leads);
    leads.$inject = ['$http', '$window', 'config', 'accounts'];
    function leads ($http, $window, config, accounts) {
    	var getAllLeads = function(cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.get(
    			'/api/leads/members/' + memberId, {
		        headers: {
		          Authorization: 'Bearer '+ token
		        }
		    }).success(function(data){
		    	if(cb){
		    		//console.log(data);
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var saveLead = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
			var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.post(
    			'/api/leads', 
		        {
					memberId: memberId,
					companyName: data.companyName,
					contactName: data.contactName
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var getLeadById = function(leadId, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.get(
    			'/api/leads/' + leadId, 
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	cb(err, null);
		    });
    	}

    	var updateLead = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.put(
    			'/api/leads/' + data._id, 
		        {
					companyName: data.companyName,
					url: data.url,
					description: data.description
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var saveLeadContact = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.post(
    			'/api/leads/' + data.lead + "/contacts", 
		        {
					name: data.name,
					title: data.title,
					contactChannels: data.contactChannels
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	var updateLeadContact = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.put(
    			'/api/leads/' + data.lead + "/contacts/" + data._id, 
		        {
					name: data.name,
					title: data.title,
					contactChannels: data.contactChannels
				},
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}
 
    	var deleteLeadContact = function(data, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.delete(
    			'/api/leads/' + data.lead + "/contacts/" + data._id, 
    			{
    				headers: {
		          		Authorization: 'Bearer '+ token
		        	}
		    	}
		    ).success(function(data){
		    	//console.log(data);
		    	if(cb){
		        	cb(null, data);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	//accounts.logout();
		    	cb(err, null);
		    });
    	}

    	return {
    		getAllLeads: getAllLeads,
    		saveLead: saveLead,
    		getLeadById: getLeadById,
    		updateLead: updateLead,
    		saveLeadContact: saveLeadContact,
    		updateLeadContact: updateLeadContact,
    		deleteLeadContact: deleteLeadContact
    	}
    }
})();