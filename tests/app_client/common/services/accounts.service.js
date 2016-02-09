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

	    var currentUser = function() {
	      if(isLoggedIn()){
	        var token = getToken();
	        var payload = JSON.parse($window.atob(token.split('.')[1]));
	        return {
	          email : payload.email,
	          name : payload.name
	        };
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
	      currentUser : currentUser,
	      saveToken : saveToken,
	      getToken : getToken,
	      isLoggedIn : isLoggedIn,
	      register : register,
	      login : login,
	      logout : logout
	    };
    }
})();