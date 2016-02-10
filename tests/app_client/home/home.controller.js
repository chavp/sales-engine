(function () {
	angular
	  .module('salesHubApp')
      .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$location', 'accounts'];
    function homeCtrl($scope, $location, accounts) {
    	var vm = this;

        vm.currentPath = $location.path();
        
    	vm.message = "Hello";

    	vm.doLogout = function(){
    	 	accounts.logout();
    	 	$location.path('/');
    	}
    }
    
})();