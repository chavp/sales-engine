(function () {
	angular
	  .module('salesHubApp')
      .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location', '$window', '$log', 'featureToggle', 'config', 'accounts'];
    function loginCtrl($location, $window, $log, featureToggle, config, accounts) {
    	var vm = this;
      vm.currentPath = $location.path();
      
      // tooglefeature
      vm.forgtPassword = featureToggle.isEnabled('forgtPassword');
      vm.createAccount = featureToggle.isEnabled('createAccount');

    	vm.message = "TEST";
    	vm.credentials = {
	      username : "my.parinya@gmail.com",
	      password : "123456789"
	    };
      vm.errorEmail = "";
      vm.errorPassword = "";

	    vm.returnPage = $location.search().page || '/';

	    //console.log(vm.returnPage);
	    
    	vm.onSubmit = function () {
	      vm.formError = "";
        vm.errorUsername = "";
        vm.errorPassword = "";
	      //console.log(vm.credentials.email);
	      if (!vm.credentials.username){
        	vm.errorUsername = "Required";
        }
        if (!vm.credentials.password){
          vm.errorPassword = "Required";
        }

        //console.log(vm.errorEmail);

	      if (vm.errorPassword || vm.errorPassword) {
	        //vm.formError = "All fields required, please try again";
	        return false;
	      } 

        vm.doLogin();
    	};

    	vm.doLogin = function(){
    	  vm.formError = "";
        vm.loading = true;
        accounts
          .login(vm.credentials)
          .error(function(err){
            $log.error(err);
            if(err) {
              vm.formError = err.message;
              vm.loading = false;
              $log.error(err);
            }
            //console.log(err);
          })
          .then(function(response){
            //console.log(response);
            //$location.search('page', null); 
            //$location.path('/home');
            $window.location = config.DEFAULT_PATH;
            //$window.location.reload();
          });
    	}

      if(accounts.isLoggedIn()){
        //leftNavigationCtrl.isLoggedIn;
        $location.path(config.DEFAULT_PATH);
      }
    }
    
})();