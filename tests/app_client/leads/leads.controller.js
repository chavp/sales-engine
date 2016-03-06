(function () {
	angular
	  .module('salesHubApp')
      .controller('leadsCtrl', leadsCtrl);

    leadsCtrl.$inject = [
        '$scope',
        '$window', 
        '$rootScope', 
        '$location', 
        '$log', 'config', 'blockUI', 
        'accounts', 'leads', 'emails'];
    function leadsCtrl(
        $scope,
        $window, 
        $rootScope, 
        $location, 
        $log, config, blockUI, accounts, leads, emails) {
    	var vm = this;

        // event on
        var REFRESH_LEAD = $rootScope.$on('REFRESH_LEAD', function(){
            //console.log(params);
            vm.refreshLeads();

            
        });
        
        $scope.$on("$destroy", REFRESH_LEAD);
        // end event

        vm.currentPath = $location.path();
        
        vm.leadsQuery = "All";
    	vm.title = "All leads";

        vm.totalResults = 0;
        
        vm.formError = "";
        vm.leadResults = [];

        vm.itemsByPage = 10;
        vm.phonePrefix = "+66";

        //var leadResultsBlock = blockUI.instances.get('lead-results-block');
        vm.refreshLeads = function(){
            //vm.isLoading = true;

            blockUI.start();
            leads.getAllLeads(function(err, data){
                //vm.isLoading = false;
                blockUI.stop();
                if(!err){
                    $log.debug(data);
                    if(!data) {
                        accounts.logout();
                        $window.location = config.DEFAULT_PATH;
                    }
                    var results = data.map(function(d){
                        if(d.contacts.length > 0){
                            var conChannels = d.contacts[0].contactChannels;
                            for (var i = 0; i < conChannels.length; i++) {
                                var name = conChannels[i].name;
                                if(validateEmail(name)) {
                                    d.email = name;
                                    break;
                                }
                            };
                            for (var i = 0; i < d.tags.length; i++) {
                                var name = d.tags[i].tag;
                                if(validatePhone(name)) {
                                    d.phone = vm.phonePrefix + " " + name;
                                    break;
                                }
                            };
                        }
                        return {
                            _id: d._id,
                            company : d.companyName || config.EMPATY_DISPLAY,
                            contacts : d.contacts,
                            phone: d.phone || '',
                            email: d.email || '',
                            status: ""
                        }
                    });
                    
                    vm.leadResults = results;
                }
            });
        }

        vm.beginEmail = function(lead){
            $location
                .path('/leads/' + lead._id)
                .search({to: lead.email});
            /*$rootScope.$emit("BEGIN_SEND_MAIL", {
              to: [lead.email]
            });*/
        }

        vm.showLead = function(lead){
            $location
                .path('/leads/' + lead._id);
            /*$rootScope.$emit("BEGIN_SEND_MAIL", {
              to: [lead.email]
            });*/
        }

        vm.refreshLeads();
    }
    
})();