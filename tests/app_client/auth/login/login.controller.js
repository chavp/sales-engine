(function () {
	angular
	  .module('salesHubApp')
      .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location', 'accounts'];
    function loginCtrl($location, accounts) {
    	var vm = this;

    	vm.message = "TEST";
    	vm.credentials = {
	      username : "",
	      password : ""
	    };

	    vm.returnPage = $location.search().page || '/';

	    //console.log(vm.returnPage);
	    
    	vm.onSubmit = function () {
	      vm.formError = "";
	      //console.log(vm.credentials.email);
	      /*if (!vm.credentials.email){
        	vm.emailError = "Required";
      		}
      	  if (!vm.credentials.password){
        	vm.passwordError = "Required";
      	  }*/
	      if (!vm.credentials.username || !vm.credentials.password) {
	        vm.formError = "All fields required, please try again";
	        return false;
	      } else {
	        vm.doLogin();
	      }
    	};

    	vm.doLogin = function(){
    	  vm.formError = "";
        accounts
          .login(vm.credentials)
          .error(function(err){
            vm.formError = err;
          })
          .then(function(){
            //console.log("5555");
            $location.search('page', null); 
            $location.path('/home');
          });
    	}

      if(accounts.isLoggedIn())
        $location.path('/home');
    }
    
})();