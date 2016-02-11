(function () {
	angular
	  .module('salesHubApp')
      .controller('newleadCtrl', newleadCtrl);

    newleadCtrl.$inject = ['$scope', '$location', '$uibModalInstance'];
    function newleadCtrl($scope, $location, $uibModalInstance) {
    	var vm = this;

        vm.currentPath = $location.path();
        
    	vm.title = "New Lead";
        vm.lead = {
            companyName: "",
            contactName: ""
        };
        vm.formError = "";
    	vm.doCreateLead = function(){
            vm.formError = "";
            if(!vm.lead.companyName && !vm.lead.contactName){
                vm.formError = "Please required Company/Organization Name or Contact Name.";
                return;
            }
    	 	alert("OK");
    	}

        vm.doCancel = function () {
            $uibModalInstance.dismiss('cancel');

        };
    }
    
})();