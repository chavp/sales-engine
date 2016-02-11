(function(){
	
	angular
	  .module('salesHubApp', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'smart-table']);

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
	      .when('/leads', {
	        templateUrl: '/leads/leads.view.html',
	        controller: 'leadsCtrl',
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
      .run(['$rootScope', '$location', '$window', 'accounts', 
      	function ($rootScope, $location, $window, accounts) {
      		//console.log(accounts.isLoggedIn());
      		if (!accounts.isLoggedIn()) {
      			//event.preventDefault();
      			$location.path('/');
      			//$window.location.reload();
      		}else{
      			if($location.path() === '/'){
      				$location.path('/home');
      			}
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