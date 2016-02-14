(function () {
	angular
	  .module('salesHubApp')
      .controller('leadCtrl', leadCtrl);

    leadCtrl.$inject = ['$rootScope', '$routeParams', '$location', '$log', 'config', 
    'blockUI', 
    'leads'];
    function leadCtrl($rootScope, $routeParams, $location, $log, config, blockUI, leads) {
    	var vm = this;

        $rootScope.$on('refreshLead_event', function(event, params){
            //console.log(params);
            var result = Enumerable
                .From(vm.contacts)
                .Where(function(i){return i.uuid == params.uuid && i._id == null}).SingleOrDefault();

            if(result){
                for (var i = 0; i < vm.contacts.length; i++) {
                    if(params.uuid === vm.contacts[i].uuid){
                        vm.contacts.splice(i, 1);
                        break;
                    }
                }
            }
        });

        vm.isEmpaty = function(){
            return vm.contacts.length === 0;
        };

    	vm.companyName = "";
        vm.lead = {
            _id: null,
            companyName: "",
            url: "",
            description: "",
        };

        vm.oldLead = {};

        vm.contacts = [];

    	leads.getLeadById($routeParams.leadId, function	(err, result){
            //console.log(result);
    		if(err) {
                $location.path('/leads');
                return false;
            }
            if(!result){
                $location.path('/leads');
                return false;
            }
            vm.lead._id = $routeParams.leadId;
    		vm.lead.companyName = result.companyName;
            vm.lead.url = result.url;
            vm.lead.description = result.description;

            vm.oldLead = result;

            if(result.contacts.length == 0){ // add new contact
                vm.contacts.push({
                    uuid: guid(),
                    _id: null,
                    name: "",
                    title: "",
                    lead: vm.lead._id
                });
            }else{
                vm.contacts = result.contacts;
                //console.log(vm.contacts);
            }
    	});
    	//console.log($routeParams);

        vm.editing = false;
        vm.errorUrl = "";

        var resetForm = function(){
            vm.editing = false;
            vm.focusCompanyName = false;
            vm.focusURL = false;
            vm.focusDescription = false;

            vm.errorUrl = "";
        }

        vm.validDescription = function(){
            //$log.info(vm.lead.description);
            if(vm.lead.description === '' ||
                vm.lead.description === undefined) return false;
            return true;
        }

        vm.validUrl = function(){
            if(vm.lead.url === '' ||
                vm.lead.url === undefined) return false;
            return true;
        }

        vm.edit = function(focus){
            //console.log(angular.element($event.currentTarget).focus());
            if(focus == 'company'){
                vm.focusCompanyName = true;
            }else if(focus == 'url'){
                vm.focusURL = true;
            }else if(focus == 'description'){
                vm.focusDescription = true;
            }
            vm.editing = true;
        }

        var form = $( "#edit-lead-form" )
            .validate({
              errorClass:'error-font',
              errorElement: 'span',
              rules: {
                url: {
                  required: false,
                  url: true
                }
              }
            });

        vm.save = function(){
            //console.log(vm.lead);
            vm.errorUrl = "";
            var validUrl = form.valid();
            //console.log(validUrl);
            if(!validUrl){
                //vm.errorUrl = "Invalid URL.";
                return false;
            }

            vm.loading = true;
            leads.updateLead(vm.lead, function(err, result){
                vm.loading = false;
                resetForm();

                if(err) {
                    $log.error(err);
                    return false;
                }
                //console.log(result);
                vm.lead.companyName = result.companyName;
                vm.lead.url = result.url;
                vm.lead.description = result.description;

                vm.oldLead = result;
            });
        }

        vm.cancle = function(){
            resetForm();

            vm.lead.companyName = vm.oldLead.companyName;
            vm.lead.url = vm.oldLead.url;
            vm.lead.description = vm.oldLead.description;
        }

        vm.addContact = function(){
            //console.log(vm.contacts);
            vm.contacts.push({
                uuid: guid(),
                _id: null,
                name: "",
                title: "",
                lead: vm.lead._id
            });
        }
    }

})();