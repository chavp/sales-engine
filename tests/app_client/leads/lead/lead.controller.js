(function () {
	angular
	  .module('salesHubApp')
      .controller('leadCtrl', leadCtrl);

    leadCtrl.$inject = [
        '$rootScope', 
        '$routeParams', '$location', '$log', 'config', 
        'blockUI', 
        'leads', 
        'leadEvents'];
    function leadCtrl($rootScope, $routeParams, $location, $log, config, blockUI, leads, leadEvents) {
    	var vm = this;

        //console.log($scope.ledvm);

        vm.isCanEmail = true;
        vm.isCanCall = false;
        vm.leadId = $routeParams.leadId;

        $rootScope.$on('UPDATE_LEAD_TOOLS', function(event, params){
            //console.log(params);
            if(params.isCanEmail){
                vm.isCanEmail = params.isCanEmail;
            }
            if(params.isCanCall){
                vm.isCanCall = params.isCanCall;
            }
        });

        vm.isEmpaty = function(){
            return vm.contacts.length === 0;
        };

        // event type = { note, email, call, etc }
        // fillter all, mine
        vm.events = [];

        // optional: not mandatory (uses angular-scroll-animate)
        vm.animateElementIn = function($el) {
            //console.log($el);
            $el.removeClass('timeline-hidden');
            $el.addClass('bounce-in');
        };

        vm.animateElementIn2 = function($el) {
            //console.log($el);
            var eventid = $($el[0].outerHTML).data('eventid');
            if(!eventid) {
                //console.log(eventid);
                //console.log($($el[0].outerHTML).data('eventid'));
                $el.removeClass('timeline-hidden');
                $el.addClass('bounce-in');
            }
        };

        // optional: not mandatory (uses angular-scroll-animate)
        vm.animateElementOut = function($el) {
            $el.addClass('timeline-hidden');
            $el.removeClass('bounce-in');
        };
        
        vm.deleting = false;
        vm.deleteLead = function(){
            vm.deleting = true;
            leads.deleteLead(vm.leadId, function(err, result){
                vm.deleting = false;
                if(err) {
                    $location.path('/leads');
                    return false;
                }

                $location.path('/leads');
            });
        }

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

        
        leadEvents.getEvents(vm.leadId, function(err, result){
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
            vm.noteFocus = true;
        }

        vm.doneNote = function(){
            $log.debug(vm.oneEvent);
            if(!vm.oneEvent.content){
                vm.deleteEvent();
                return;
            }
            leadEvents.saveLeadNote(vm.leadId, vm.oneEvent, function(err, result){
                if(err) {
                    $log.error(err);
                    return false;
                }

                vm.oneEvent._id = result._id;
                vm.oneEvent.createdAt = result.createdAt;
                vm.oneEvent.riaseFrom = result.riaseFrom;

                delete vm.oneEvent;

                $('timeline-panel').removeClass('bounce-in');
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