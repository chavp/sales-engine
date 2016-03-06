(function () {
  angular
    .module('salesHubApp')
    .controller('leadProfileCtrl', leadProfileCtrl);

  leadProfileCtrl.$inject = ['$rootScope', '$routeParams', '$location', '$log', 'leads', 'featureToggle'];
  function leadProfileCtrl($rootScope, $routeParams, $location, $log, leads, featureToggle) {
  	var vm = this;

    $rootScope.$on('UPDATE_LEAD_CONTACTS', function(event, params){
            
            var result = null;
            if(params.event === 'cancle'){
                result = Enumerable
                    .From(vm.contacts)
                    .Where(function(i){return i.uuid == params.uuid && i._id == null;}).SingleOrDefault();

            } else if(params.event === 'deleted'){
                result = Enumerable
                    .From(vm.contacts)
                    .Where(function(i){return i.uuid == params.uuid;}).SingleOrDefault();
                console.log(result);
            }

            if(result){
                for (var i = 0; i < vm.contacts.length; i++) {
                    if(params.uuid === vm.contacts[i].uuid){
                        vm.contacts.splice(i, 1);
                        break;
                    }
                }
            }
        });

  	vm.editing = false;
  	vm.lead = {
        _id: null,
        companyName: "",
        url: "",
        description: "",
    };

    vm.oldLead = {};
    vm.contacts = [];
    vm.editing = false;
    vm.errorUrl = "";

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

    vm.edit = function(focus){
        //console.log(angular.element($event.currentTarget).focus());
        if(focus == 'company'){
            vm.focusCompanyName = true;
        }else if(focus == 'url'){
            vm.focusURL = true;
        }else if(focus == 'description'){
            vm.focusDescription = true;
        }else if(focus == 'address'){
            vm.focusAddress = true;
        }
        vm.editing = true;
    }

    var resetForm = function(){
        vm.editing = false;
        vm.focusCompanyName = false;
        vm.focusURL = false;
        vm.focusDescription = false;
        vm.focusAddress = false;

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

    vm.validAddress = function(){
        if(vm.lead.address === '' ||
            vm.lead.address === undefined) return false;
        return true;
    }

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
            vm.lead.address = result.address;

            vm.oldLead = result;
        });
    }

    vm.cancle = function(){
        resetForm();

        vm.lead.companyName = vm.oldLead.companyName;
        vm.lead.url = vm.oldLead.url;
        vm.lead.description = vm.oldLead.description;
        vm.lead.address = vm.oldLead.address;
    }

    vm.addContact = function(){
        //console.log(vm.contacts);
        vm.contacts.push(newContact());
    }

    var newContact = function(){
        return {
            uuid: guid(),
            _id: null,
            name: "",
            title: "",
            lead: vm.lead._id,
            contactChannels: []
        };
    } 

    // get lead
    leads.getLeadById($routeParams.leadId, function	(err, result){
            $log.debug(result.tags);
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
            vm.lead.address = result.address;
            vm.lead.tags = result.tags;
            $rootScope.$emit("UPDATE_LEAD_TAGS", {
                leadId: $routeParams.leadId,
                tags: result.tags,
                newtags: []
            });
            vm.oldLead = result;

            if(result.contacts.length == 0){ // add new contact
                vm.contacts.push(newContact());
            }else{
                vm.contacts = result.contacts.map(function(contact){
                    return {
                        uuid: guid(),
                        _id: contact._id,
                        name: contact.name,
                        title: contact.title,
                        lead: vm.lead._id,
                        contactChannels: contact.contactChannels
                    };
                });
                //vm.contacts = result.contacts;
                //console.log(vm.contacts);
            }
    	});
  }
})();