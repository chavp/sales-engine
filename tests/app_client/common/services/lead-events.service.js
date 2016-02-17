(function () {
	angular
    	.module('salesHubApp')
    	.service('leadEvents', leadEvents);
    leadEvents.$inject = ['$http', '$window', 'config', 'accounts'];
    function leadEvents ($http, $window, config, accounts) {

    	var getEvents = function(leadId, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		//var payload = JSON.parse($window.atob(token.split('.')[1]));
    		//var memberId = payload._id;
    		$http.get(
    			'/api/leads/' + leadId + '/events', {
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

    	var saveLeadNote = function(leadId, leadEvent, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		var payload = JSON.parse($window.atob(token.split('.')[1]));
    		var memberId = payload._id;
    		$http.post(
    			'/api/leads/' + leadId + '/events', 
		        {
					memberId: memberId,
					title: leadEvent.title,
					content: leadEvent.content,
					type: leadEvent.type
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

    	return {
    		getEvents: getEvents,
    		saveLeadNote: saveLeadNote
    	};
    }

})();