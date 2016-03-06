
(function () {
	angular
	  .module('salesHubApp')
      .controller('leadCtrl', leadCtrl);

    leadCtrl.$inject = [
        '$scope',
        '$rootScope', 
        '$routeParams', '$location', '$log', 'config', 
        'blockUI', 
        'Upload',
        'leads', 
        'leadEvents',
        'accounts',
        'emails',
        'files'];
    function leadCtrl(
            $scope,
            $rootScope, 
            $routeParams, $location, $log, config, 
            blockUI, Upload,
            leads, leadEvents, accounts, emails, files) {
    	var vm = this;

        //console.log($scope.ledvm);
        //$log.debug($scope.ledvm);

        vm.isCanEmail = false;
        vm.isCanCall = false;
        vm.leadId = $routeParams.leadId;

        /*if(vm.tags && vm.tags.length > 0){
            vm.tags.forEach(function(tag){
                if(tag.type === 'Email'){
                    vm.isCanEmail = true;
                }
                if(tag.type === 'Phone'){
                    vm.isCanCall = true;
                }
            });
        }*/

        // event
        var UPDATE_LEAD_TOOLS = $rootScope.$on('UPDATE_LEAD_TOOLS', function(event, params){
            //console.log(params);
            if(params.isCanEmail){
                vm.isCanEmail = params.isCanEmail;
            }
            if(params.isCanCall){
                vm.isCanCall = params.isCanCall;
            }
        });

        vm.currentUser= $rootScope.currentUser;
        var UPDATE_MEMBER = $rootScope.$on('UPDATE_MEMBER', function(event, params){
            vm.currentUser = params.currentUser;
        });

        var UPDATE_LEAD_TAGS = $rootScope.$on('UPDATE_LEAD_TAGS', function(event, params){
            //$log.debug("old tags: " + vm.tags);
            //$log.debug("new tags: " + params.newtags);
            if(params.leadId == vm.leadId) { // OK target
                var tags = [];
                if(params.newtags && params.newtags.length > 0){
                    params.newtags.forEach(function(tag){
                        if(validateEmail(tag)){
                            tags.push({
                                tag: tag,
                                type: 'Email'
                            });
                        } else if(validatePhone(tag)){
                            tags.push({
                                tag: tag,
                                type: 'Phone'
                            });
                        }
                    });

                    if(tags && tags.length > 0) {
                        // save tags
                        leads.saveTags({
                            leadId: vm.leadId,
                            tags: tags
                        }, function(err, result){
                            vm.tags = result.tags;
                            updateTools();

                            //$log.debug("update tags: " + result.tags);
                        });
                    }
                }
                
                if(params.tags && params.tags.length > 0){
                    vm.tags = params.tags;
                    updateTools();
                }
            }
        });

        var BEGIN_SEND_MAIL = $rootScope.$on('BEGIN_SEND_MAIL', function(event, params){
            vm.addEmail(params.to);
        });

        $scope.$on("$destroy", UPDATE_LEAD_TOOLS);
        $scope.$on("$destroy", UPDATE_MEMBER);
        $scope.$on("$destroy", UPDATE_LEAD_TAGS);
        $scope.$on("$destroy", BEGIN_SEND_MAIL);
        /////////////////////////////////////////////

        var updateTools = function(){
            vm.isCanEmail = false;
            vm.isCanCall = false;

            vm.tags.forEach(function(tag){
                if(tag.type === 'Email'){
                    vm.isCanEmail = true;
                }
                if(tag.type === 'Phone'){
                    vm.isCanCall = true;
                }
            });
        }

        vm.isEmpaty = function(){
            return vm.contacts.length === 0;
        };

        // event type = { note, email, call, etc }
        // fillter all, mine
        vm.events = [];
        vm.toEmails = [];
        vm.ccEmails = [];
        vm.bccEmails = [];
        vm.attachFiles = [];
        vm.subject = "";
        vm.loadEmail = function($query){
            var emails = [];
            if(vm.tags && vm.tags.length > 0){
                for (var i = 0; i < vm.tags.length; i++) {
                    if(vm.tags[i].type == 'Email') 
                        emails.push(vm.tags[i].tag); 
                }
            }
            //console.log(emails);
            return emails;
        }

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
                    vm.events.push( new EventModel(event, 'default', 'fa fa-newspaper-o') );

                } else if(event.type === 'Note'){
                    vm.events.push( new EventModel(event, 'warning', 'glyphicon-comment') );
                } else if(event.type === 'Email'){
                    //console.log(event);
                    vm.events.push( new EventModel(event, 'info', 'glyphicon-envelope') );
                } 
            };
        });
    	//console.log($routeParams);

        vm.oneEvent = null;
        vm.addNote = function(){
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

        vm.addEmail = function(to){
            if(vm.oneEvent != null){
                vm.events.shift(vm.oneEvent);
                delete vm.oneEvent;
            }
            vm.oneEvent = {
                uuid: guid(),
                type: 'Email',
                badgeClass: 'info',
                badgeIconClass: 'glyphicon-envelope',
                title: '',
                content: ''
            };
            if(to) {
                vm.toEmails = to;
            }
            vm.events.unshift(vm.oneEvent);
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

            vm.toEmails = [];
            vm.subject = "";
            vm.content = "";
            vm.attachFiles = [];
            vm.uploading = false;

            vm.cancleCc();
            vm.cancleBcc();
        }

        // email
        vm.haveCc = false;
        vm.addCc = function(){
            vm.haveCc = true;
        }
        vm.cancleCc = function(){
            vm.haveCc = false;
            vm.ccEmails = [];
        }

        vm.haveBcc = false;
        vm.addBcc = function(){
            vm.haveBcc = true;
        }
        vm.cancleBcc = function(){
            vm.haveBcc = false;
            vm.bccEmails = [];
        }

        vm.deleteFile = function(file){
            //console.log(file);
            files.delete(
                { pathId: file.pathId, attachFileId: file.attachFileId }, 
                function(err, res){
                    removeByField(vm.attachFiles, 'pathId', file.pathId);
                });
        }

        // for multiple files:
        //vm.uploading = false;
        vm.uploadFiles = function () {
            if (vm.attachFiles && vm.attachFiles.length) {
                var token = accounts.getToken();
                //vm.uploading = true;
                vm.attachFiles.forEach(function(file){
                    file.uploading = true;
                    Upload.upload({
                        url: '/api/files/',
                        method: 'POST',
                        data: {
                            file: file
                        },
                        headers : {
                            'Content-Type': file.type,
                            'Authorization': 'Bearer '+ token
                        }
                        //headers: {'Authorization': 'xxx'}
                    }).then(function (resp) {
                        var response = resp.data;
                        file.uploading = false;
                        file.attachFileId = response.attachFileId;
                        file.pathId = response.pathId;
                        file.length = response.length;

                        //console.log(vm.attachFiles);
                        console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + response.message);
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        if(progressPercentage === 100){
                            file.uploading = false;
                        }
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                });
            }
        }

        vm.saveDraft = function(){
            if(vm.toEmails.length == 0){
                return false;
            }
            //console.log(vm.toEmails);
            emails.saveDraft({
                memberId: vm.currentUser._id,
                leadId: vm.leadId,
                from: vm.currentUser.email,
                to: vm.toEmails.map(function(d){ return d.text; }),
                cc: vm.ccEmails.map(function(d){ return d.text; }),
                bcc: vm.bccEmails.map(function(d){ return d.text; }),
                subject: vm.subject,
                content: vm.content,
                attachs: vm.attachFiles.map(function(d){ 
                    return {
                        fileName: d.name,
                        pathId: d.pathId,
                        fileSize: d.length
                    }; 
                })
            }, function(err, event){
                //console.log(event);
                vm.deleteEvent();
                vm.events.unshift(  new EventModel(event, 'info', 'glyphicon-envelope') );
            });
        }

        vm.saveEventDraft = function(event){
            //console.log(event);
            if(event.compose.to.length == 0){
                return false;
            }
            var attachs = [];
            if(event.compose.attachs) {
                event.compose.attachs.forEach(function(d){
                    attachs.push({
                        fileName: d.name,
                        pathId: d.pathId,
                        fileSize: d.length
                    });
                });
            }
            if(event.compose.newAttachs) {
                event.compose.newAttachs.map(function(d){
                    attachs.push({
                        fileName: d.name,
                        pathId: d.pathId,
                        fileSize: d.length
                    });
                });
            }
            //console.log(attachs);
            emails.updateDraft({
                memberId: vm.currentUser._id,
                leadId: vm.leadId,
                composeId: event.compose._id,
                from: event.compose.from,
                to: event.compose.to.map(function(d){ return d.text; }),
                cc: event.compose.cc.map(function(d){ return d.text; }),
                bcc: event.compose.bcc.map(function(d){ return d.text; }),
                subject: event.compose.subject,
                content: event.compose.content,
                attachs: attachs
            }, function(err, ev){
                //console.log(event);
                //vm.deleteEvent();
                event.endEdit();
                //vm.events.unshift(  new EventModel(event, 'info', 'glyphicon-envelope') );
            });
        }

        vm.sendMail = function(event){
            if(event) {
                if(event.compose.to.length == 0) return false;
                if(!event.compose.subject) return false;
                if(!event.compose.content) return false;
                
                emails.sendMail(
                    event.compose._id, 
                    function(err, ev){
                        event.compose.status = ev.status;
                        removeByField(vm.events, 'uuid', event.uuid);
                        vm.events.unshift(  new EventModel(event, 'info', 'glyphicon-envelope') );
                    }
                );
            } else {
                if(vm.toEmails.length == 0) return false;
                if(!vm.subject) return false;
                if(!vm.content) return false;

                emails.sendNewMail({
                    memberId: vm.currentUser._id,
                    leadId: vm.leadId,
                    from: vm.currentUser.email,
                    to: vm.toEmails.map(function(d){ return d.text; }),
                    cc: vm.ccEmails.map(function(d){ return d.text; }),
                    bcc: vm.bccEmails.map(function(d){ return d.text; }),
                    subject: vm.subject,
                    content: vm.content,
                    attachs: vm.attachFiles.map(function(d){ 
                        return {
                            fileName: d.name,
                            pathId: d.pathId,
                            fileSize: d.length
                        }
                    })
                }, function(err, ev){
                    vm.deleteEvent();
                    vm.events.unshift(  new EventModel(ev, 'info', 'glyphicon-envelope') );
                });
            }
            
            /*$log.debug(vm.toEmails);
            $log.debug(vm.ccEmails);
            $log.debug(vm.bccEmails);
            $log.debug(vm.attachFiles);*/
        }

        vm.deleteEventFile = function(event, file){
            console.log(file);
            files.delete(
                { 
                    pathId: file.pathId, 
                    attachFileId: file._id 
                }, 
                function(err, res){
                    removeByField(event.compose.attachs, 'pathId', file.pathId);
                    removeByField(event.compose.newAttachs, 'pathId', file.pathId);
                });
        }

        vm.deleteEventDraft = function(event){
            //alert(fileId);
            emails.deleteDraft(
                event.compose._id, 
                function(err, ev){
                    removeByField(vm.events, 'uuid', event.uuid);
                }
            );
        }

        vm.uploadEventFiles = function(event){
            //event.uploading = true;
            /*event.compose.attachs.forEach(file){
                file.uploading = false;
            }*/
            if (event.compose.newAttachs && event.compose.newAttachs.length ) {
                var token = accounts.getToken();
                //vm.uploading = true;
                event.compose.newAttachs.forEach(function(file){
                    file.uploading = true;
                    Upload.upload({
                        url: '/api/files/',
                        method: 'POST',
                        data: {
                            file: file,
                            composeId: event.compose._id
                        },
                        headers : {
                            'Content-Type': file.type,
                            'Authorization': 'Bearer '+ token
                        }
                        //headers: {'Authorization': 'xxx'}
                    }).then(function (resp) {
                        var response = resp.data;
                        file.uploading = false;
                        file._id = response.attachFileId;
                        file.pathId = response.pathId;
                        file.length = response.length;

                        //console.log(vm.attachFiles);
                        console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + response.message);
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        if(progressPercentage === 100){
                            file.uploading = false;
                        }
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                });
            }
        }

        if($routeParams.to){
            vm.addEmail([$routeParams.to]);
        }
    }

})();