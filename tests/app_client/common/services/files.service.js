(function () {
	angular
    	.module('salesHubApp')
    	.service('files', files);
    files.$inject = ['$http', '$window', 'config', 'accounts'];

    function files ($http, $window, config, accounts) {

    	var deleteFile = function(params, cb){
    		if(!accounts.isLoggedIn()) return false;
    		var token = accounts.getToken();
    		$http.post(
    			'/api/files/' + params.pathId, 
    			{
    				attachFileId: params.attachFileId
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

    	return {
    		delete: deleteFile
    	}
    }
})();