(function () {
	angular
	  .module('salesHubApp')
      .controller('leadsCtrl', leadsCtrl);

    leadsCtrl.$inject = ['$rootScope', '$location', 'config', 'blockUI', 'leads'];
    function leadsCtrl($rootScope, $location, config, blockUI, leads) {
    	var vm = this;

        $rootScope.$on('refreshLeads_event', function(){
            //console.log(params);
            vm.refreshLeads();

            
        });

        vm.currentPath = $location.path();
        
        vm.leadsQuery = "All";
    	vm.title = "All leads";

        vm.totalResults = 0;
        
        vm.formError = "";
        vm.leadResults = [];

        vm.itemsByPage = 10;

        //var leadResultsBlock = blockUI.instances.get('lead-results-block');
        vm.refreshLeads = function(){
            //vm.isLoading = true;

            blockUI.start();
            leads.getAllLeads(function(err, data){
                //vm.isLoading = false;
                blockUI.stop();
                if(!err){
                    console.log(data);
                    var results = data.map(function(d){
                        return {
                            _id: d._id,
                            company : d.companyName || config.EMPATY_DISPLAY,
                            contacts : d.contacts,
                            phone: data.phone || '',
                            email: data.email || '',
                            status: ""
                        }
                    });
                    vm.leadResults = results;
                }
            });
        }

        vm.refreshLeads();
    }
    
})();