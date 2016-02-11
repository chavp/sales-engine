(function () {
	angular
	  .module('salesHubApp')
      .controller('leadsCtrl', leadsCtrl);

    leadsCtrl.$inject = ['$scope', '$location'];
    function leadsCtrl($scope, $location) {
    	var vm = this;

        vm.currentPath = $location.path();
        
        vm.leadsQuery = "All";
    	vm.title = "All leads";

        vm.totalResults = 0;
        
        vm.formError = "";

        vm.leadResults = [
            { 
                company: "My HOME",
                email: "asdasd@asdasd.ccc",
                phone: "56745465465",
                contacts: "Ding",
                status: "Potential"
            },
            {
                company: "ddddd",
                email: "asdasd@asdasd.ccc",
                phone: "56745465465",
                contacts: "dddd",
                status: "Qualified"
            }
        ];

    }
    
})();