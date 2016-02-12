(function () {
	angular
	  .module('salesHubApp')
      .controller('leadsCtrl', leadsCtrl);

    leadsCtrl.$inject = ['$scope', '$location', 'config', 'leads'];
    function leadsCtrl($scope, $location, config, leads) {
    	var vm = this;

        vm.currentPath = $location.path();
        
        vm.leadsQuery = "All";
    	vm.title = "All leads";

        vm.totalResults = 0;
        
        vm.formError = "";
        vm.leadResults = [];

        leads.getAllLeads(function(success, data){
            if(success){
                console.log(data);
                vm.leadResults = data;
            }
        });

        vm.isSelected = function(data){
            console.log(this);
        }
    }
    
})();