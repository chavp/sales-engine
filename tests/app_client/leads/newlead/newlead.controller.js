(function () {
	angular
	  .module('salesHubApp')
      .controller('newleadCtrl', newleadCtrl);

    newleadCtrl.$inject = [ '$rootScope', '$location', '$log', '$uibModalInstance', 'leads'];
    function newleadCtrl($rootScope, $location, $log, $uibModalInstance, leads) {
    	var vm = this;

        vm.currentPath = $location.path();
        
    	vm.title = "New Lead";
        vm.newlead = {
            companyName: "",
            contactName: ""
        };
        vm.formError = "";
        vm.loading = false;
    	vm.doCreateLead = function(){
            vm.formError = "";
            if(!vm.newlead.companyName && !vm.newlead.contactName){
                vm.formError = "Please required Company/Organization Name or Contact Name.";
                return;
            }
            vm.loading = true;
            leads.saveLead(vm.newlead, function(err, result){
                vm.loading = false;
                if(err) $log.error(err);
                $log.info(result);
                //leadsCtrl.refreshLeads();
                $location.path('/leads');
                $rootScope.$emit("REFRESH_LEAD", {});
            });
    	 	//alert("OK");
            $uibModalInstance.close({ success: true, message: 'Save!' });
    	}

        vm.doCancel = function () {
            $uibModalInstance.dismiss('cancel');
            
        };
    }
    
})();