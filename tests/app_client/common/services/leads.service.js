(function () {
	angular
    	.module('salesHubApp')
    	.service('leads', leads);
    leads.$inject = ['$http', '$window', 'config', 'accounts'];
    function leads ($http, $window, config, accounts) {
    	var getAllLeads = function(callback){
    		if(!accounts.isLoggedIn()) return [];
    		var token = accounts.getToken();

    		var payload = JSON.parse($window.atob(token.split('.')[1]));

    		var memberId = payload._id;
    		$http.get('/api/leads/members/' + memberId, {
		        headers: {
		          Authorization: 'Bearer '+ token
		        }
		    }).success(function(data){
		    	if(callback){
		    		//console.log(data);
		    		var results = data.map(function(d){
		    			return {
		    				_id: d._id,
		    				company : d.companyName || config.EMPATY_DISPLAY,
			          		contacts : "",
			          		phone: "",
			          		email: "",
			          		status: ""
		          		}
		    		});
		        	callback(true, results);
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	logout();
		    	callback(false, err);
		    });
    	}

    	return {
    		getAllLeads: getAllLeads
    	}
    }
})();