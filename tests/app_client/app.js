(function(){
	// feature config
  	window.angularFeaturesConf = {
  		home: false,
  		forgtPassword: false,
  		createAccount: false,
  		searchLead: false
  	};

	angular
	  .module('salesHubApp', 
	  	['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', 'smart-table', 'yh.featureToggle'])
	  .constant("config", {
        	"TOKEN_NAME": "sales_hub_token",
        	"EMPATY_DISPLAY": "Untitled",
        	"DEFAULT_PATH": "/leads"
       });

	function config ($routeProvider, $locationProvider) {
		$routeProvider
	      .when('/', {
	        templateUrl: '/auth/login/login.view.html',
	        controller: 'loginCtrl',
	        controllerAs: 'vm'
	      })
	      /*.when('/home', {
	        templateUrl: '/home/home.view.html',
	        controller: 'homeCtrl',
	        controllerAs: 'vm'
	      })*/
	      .when('/leads', {
	        templateUrl: '/leads/leads.view.html',
	        controller: 'leadsCtrl',
	        controllerAs: 'vm'
	      })
	      .when('/leads/:leadId', {
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
      .run(['$rootScope', '$location', '$window', 'config', 'accounts', 
      	function ($rootScope, $location, $window, config, accounts) {
      		//console.log(accounts.isLoggedIn());
      		if (!accounts.isLoggedIn()) {
      			//event.preventDefault();
      			$location.path('/');
      			//$window.location.reload();
      		}else{
      			if($location.path() === '/'){
      				$location.path(config.DEFAULT_PATH);
      			}
      		}
      		//http://fdietz.github.io/recipes-with-angular-js/urls-routing-and-partials/listening-on-route-changes-to-implement-a-login-mechanism.html
      		/*$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		      if (!accounts.isLoggedIn()) {
		      	$location.path('/');
		        // no logged user, redirect to /login
		        if ( next.templateUrl === "partials/login.html") {
		        } else {
		          $location.path(config.DEFAULT_PATH);
		        }
		      }
		    });*/
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