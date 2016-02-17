(function () {
	angular
	  .module('salesHubApp')
      .controller('leadCtrl', leadCtrl);

    leadCtrl.$inject = [
        '$rootScope', '$routeParams', '$location', '$log', 'config', 
        'blockUI', 
        'leads', 
        'leadEvents'];
    function leadCtrl($rootScope, $routeParams, $location, $log, config, blockUI, leads, leadEvents) {
    	var vm = this;

        $rootScope.$on('refreshLead_event', function(event, params){
            //console.log(params);
            var result = null;
            if(params.event === 'cancle'){
                result = Enumerable
                    .From(vm.contacts)
                    .Where(function(i){return i.uuid == params.uuid && i._id == null;}).SingleOrDefault();

            } else if(params.event === 'deleted'){
                result = Enumerable
                    .From(vm.contacts)
                    .Where(function(i){return i.uuid == params.uuid;}).SingleOrDefault();
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
        vm.editing = false;
        vm.errorUrl = "";

        // event type = { note, email, call, etc }
        // fillter all, mine
        vm.events = [];

        // optional: not mandatory (uses angular-scroll-animate)
        vm.animateElementIn = function($el) {
            $el.removeClass('timeline-hidden');
            $el.addClass('bounce-in');
        };

        // optional: not mandatory (uses angular-scroll-animate)
        vm.animateElementOut = function($el) {
            $el.addClass('timeline-hidden');
            $el.removeClass('bounce-in');
        };
    
        /*vm.events = [{
            badgeClass: 'success',
            badgeIconClass: 'glyphicon-earphone',
            content: 'Voicemail (30 secs) from Steli Efti 11 days ago'
          }, {
            badgeClass: 'info',
            badgeIconClass: 'glyphicon-envelope',
            title: 'Welcome to Close.io!',
            content: 'Some awesome content.'
          }, {
            badgeClass: 'warning',
            badgeIconClass: 'glyphicon-comment',
            title: 'Second heading',
            content: 'More awesome content.'
          }, {
            badgeClass: 'default',
            badgeIconClass: 'glyphicon-check',
            title: 'Tasks event',
            content: 'Task completed: Send Steli an email 14 days ago '
          }, {
            badgeClass: 'default',
            badgeIconClass: 'fa fa-newspaper-o',
            title: 'Leads event',
            content: 'Created manually.'
          }];*/

        
        var resetForm = function(){
            vm.editing = false;
            vm.focusCompanyName = false;
            vm.focusURL = false;
            vm.focusDescription = false;

            vm.errorUrl = "";
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

    	leads.getLeadById($routeParams.leadId, function	(err, result){
            $log.debug(result);
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

        leadEvents.getEvents($routeParams.leadId, function(err, result){
            $log.debug(result);
            if(err) {
                $location.path('/leads');
                return false;
            }
            if(!result){
                $location.path('/leads');
                return false;
            }
            for (var i = 0; i < result.length; i++) {
                var event = result[i];
                if(event.type === 'Lead'){
                    vm.events.push({
                        uuid: guid(),
                        badgeClass: 'default',
                        badgeIconClass: 'fa fa-newspaper-o',
                        type: event.type,
                        title: event.title,
                        content: event.content,
                        createdAt: event.createdAt,
                        riaseFrom: event.riaseFrom
                    });

                } else if(event.type === 'Note'){
                    vm.events.push({
                        uuid: guid(),
                        badgeClass: 'warning',
                        badgeIconClass: 'glyphicon-comment',
                        _id: event._id,
                        type: event.type,
                        title: event.title,
                        content: event.content,
                        createdAt: event.createdAt,
                        riaseFrom: event.riaseFrom
                    });
                }
            };
        });
    	//console.log($routeParams);

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
            vm.contacts.push(newContact());
        }

        vm.oneEvent = null;
        vm.addNote = function($el){
            $log.debug('addNote');
            if(vm.oneEvent != null){
                vm.events.shift(vm.oneEvent);
                delete vm.oneEvent;
            }
            vm.oneEvent = {
                uuid: guid(),
                type: 'Note',
                badgeClass: 'warning',
                badgeIconClass: 'glyphicon-comment',
                title: '',
                content: ''
            };
            vm.events.unshift(vm.oneEvent);
        }

        vm.doneNote = function(){
            $log.debug(vm.oneEvent);
            if(!vm.oneEvent.content){
                vm.deleteEvent();
                return;
            }
            leadEvents.saveLeadNote(vm.lead._id, vm.oneEvent, function(err, result){
                if(err) {
                    $log.error(err);
                    return false;
                }

                vm.oneEvent._id = result._id;
                vm.oneEvent.createdAt = result.createdAt;
                vm.oneEvent.riaseFrom = result.riaseFrom;

                delete vm.oneEvent;
            });
        }

        vm.deleteEvent = function(){
            if(vm.oneEvent != null){
                vm.events.splice(0, 1);
                delete vm.oneEvent;
            }
        }
    }

})();