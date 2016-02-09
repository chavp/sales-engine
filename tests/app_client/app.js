(function(){
	angular
	  .module('salesHubApp', ['ngRoute', 'ngSanitize']);

	function config ($routeProvider, $locationProvider) {
		$routeProvider
	      .when('/', {
	        templateUrl: '/auth/login/login.view.html',
	        controller: 'loginCtrl',
	        controllerAs: 'vm'
	      })
	      .when('/home', {
	        templateUrl: '/home/home.view.html',
	        controller: 'homeCtrl',
	        controllerAs: 'vm'
	      })
	      .otherwise({
	      	redirectTo: '/'
	      });

	     // use the HTML5 History API
    	$locationProvider.html5Mode({
    		enabled: true,
  			requireBase: false
  		});
	};
	
	angular
      .module('salesHubApp')
      .config(['$routeProvider', '$locationProvider', config])
      .run(['$rootScope', '$location', 'accounts', 
      	function ($rootScope, $location, accounts) {
      		//console.log(accounts.isLoggedIn());
      		if (!accounts.isLoggedIn()) {
      			event.preventDefault();
      			$location.path('/');
      		}
      	}]);

    /*angular
      .module('salesHubApp', ['$rootScope', '$location', 'accounts'])
      .run(function ($rootScope, $location, Auth) {
	    $rootScope.$on('$routeChangeStart', function (event) {
		    	if (!accounts.isLoggedIn()) {
		            console.log('DENY');
		            event.preventDefault();
		            $location.path('/');
		        }
		        else {
		            console.log('ALLOW');
		            $location.path('/home');
		        }
		    });
		});*/
})();