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
	  	[
	  		'ngRoute', 'ngSanitize', 'ngAnimate',
	  		'ui.bootstrap', 
	  		'smart-table', 
	  		'angular-ladda', 
	  		'blockUI', 
	  		'ngTagsInput',
	  		'ngFileUpload',
	  		'angular-timeline',
	  		'angular-scroll-animate',
	  		'yh.featureToggle'])
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
	        templateUrl: '/leads/lead/lead.view.html',
	        controller: 'leadCtrl',
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
      .run(['$rootScope', '$location', '$window', '$timeout', '$log',  'config', 'accounts', 
      	function ($rootScope, $location, $window, $timeout, $log, config, accounts) {
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

      		$timeout(function() {
				$log.debug('Start app_client');
			}, 3000);
      	}]);

      angular
      	.module('salesHubApp')
      	.directive('focus',
		function($timeout) {
		 return {
		 scope : {
		   trigger : '@focus'
		 },
		 link : function(scope, element) {
		  scope.$watch('trigger', function(value) {
		    if (value === "true") {
		      $timeout(function() {
		       element[0].focus();
		      });
		   }
		 });
		 }
		};
		}); 
})();