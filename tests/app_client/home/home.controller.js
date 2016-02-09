(function () {
	angular
	  .module('salesHubApp')
      .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$location', 'accounts'];
    function homeCtrl($scope, $location, accounts) {
    	// Nasty IE9 redirect hack (not recommended)
	    
    	var vm = this;

    	vm.message = "Hello";

    	vm.doLogout = function(){
    	 	accounts.logout();
    	 	$location.path('/');
    	}
    }
    
})();