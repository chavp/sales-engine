(function () {
	
	var TOKEN_NAME = 'sales_hub_token';

	angular
    	.module('salesHubApp')
    	.service('accounts', accounts);

    accounts.$inject = ['$http', '$window'];
    function accounts ($http, $window) {

    	var saveToken = function (token) {
	      $window.localStorage[TOKEN_NAME] = token;
	    };

	    var getToken = function () {
	      return $window.localStorage[TOKEN_NAME];
	    };

	    var isLoggedIn = function() {
	      var token = getToken();

	      if(token){
	        var payload = JSON.parse($window.atob(token.split('.')[1]));
	        return payload.exp > Date.now() / 1000;
	      } else {
	        return false;
	      }
	    };

	    var getCurrentUser = function(callback) {
	      if(isLoggedIn()){
	        var token = getToken();
	        var payload = JSON.parse($window.atob(token.split('.')[1]));
	        //console.log(payload);
	        var memberId = payload._id;
	        $http.get('/api/accounts/' + memberId, {
		        headers: {
		          Authorization: 'Bearer '+ token
		        }
		    }).success(function(data){
		    	if(callback){
		        	callback(true, {
		          		email : data.email,
		          		name : data.profile.firstName + " " + data.profile.lastName,
		          		phone: data.profile.phone
		        	});
	        	}
	        	//console.log(_currentUser);
		    }).error(function(err){
		    	//console.log(err);
		    	//throw err;
		    	logout();
		    	callback(false, err);
		    });
	      }
	    };

	    register = function(user) {
	      return $http.post('/api/accounts/register', user).success(function(data){
	        saveToken(data.token);
	      });
	    };

	    login = function(user) {
	      return $http.post('/api/accounts/login', user).success(function(data) {
	      	//console.log(data);
	        saveToken(data.token);
	      });
	    };

	    logout = function() {
	      $window.localStorage.removeItem(TOKEN_NAME);
	    };

    	return {
	      getCurrentUser : getCurrentUser,
	      saveToken : saveToken,
	      getToken : getToken,
	      isLoggedIn : isLoggedIn,
	      register : register,
	      login : login,
	      logout : logout
	    };
    }
})();