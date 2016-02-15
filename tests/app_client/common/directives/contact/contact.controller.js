(function () {

  angular
    .module('salesHubApp')
    .controller('contactCtrl', contactCtrl);

  contactCtrl.$inject = ['$scope', '$rootScope', '$location', '$log', 'leads', 'featureToggle'];
  function contactCtrl($scope, $rootScope, $location, $log, leads, featureToggle) {
    var vm = this;

    vm.uuid = $scope.contact.uuid;
    vm.contact = $scope.contact;
    vm.oldContact = {
        name: vm.contact.name,
        title: vm.contact.title,
        contactChannels: []
    };

    /*vm.contactChanels.push({
      _id: guid(),
      name: "0812598962",
      type: "Mobile"
    });*/

    var mem = function(data){
      vm.oldContact.name = data.name;
      vm.oldContact.title = data.title;
    }
    var back = function(data){
      vm.contact.name = data.name;
      vm.contact.title = data.title;
    }

    vm.isEditing = true;
    vm.canDelete = true;
    vm.isEmpaty = function(){
      if(vm.contact._id) return false;
      return true;
    };
    if(vm.contact._id) {
      vm.isEditing = false;
    }

    vm.containEmail = function(){
      return vm.contact.email !== null;
    }

    vm.containPhone = function(){
      return vm.contact.phone !== null;
    }

    vm.save = function(){
      vm.saving = true;
      $log.debug(vm.contact);
       if(!vm.contact._id) { // save
        //console.log("Save");
         console.log(vm.contact);

         leads.saveLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 
            vm.contact._id = result._id;

            mem(result);

            vm.isEditing = false;
            
          });
        } else { // update
          //console.log("Update");
          leads.updateLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 
            mem(result);
            // update lead
            vm.isEditing = false;
         });
      }// end if
    }

    vm.edit = function(){
      vm.isEditing = true;

      
    }

    vm.cancle = function(){
      vm.isEditing = false;
      if(vm.contact._id){
        //console.log(vm.contact);
        //console.log(vm.oldContact);
        back(vm.oldContact);
      }
      $rootScope.$emit("refreshLead_event", {
        uuid: vm.uuid,
        event: "cancle"
      });
    }

    vm.delete = function(){
      vm.deleting = true;

      leads.deleteLeadContact(vm.contact, function(err, result){
        vm.deleting = false;
        if(err) return false;
        //console.log(vm);
        $rootScope.$emit("refreshLead_event", {
          uuid: vm.uuid,
          event: "deleted"
        });

      })
    }

    vm.canDelete = function(){
      return vm.contact._id !== null;
    }

    vm.newChannel = function(){
      // default channel
      vm.contact.contactChannels.push({
        uuid: guid(),
        name: null,
        type: "Office",
        isEditing: true
      });
    }

    vm.deleteChannel = function(channel){
      $log.debug(channel);
      if(channel._id){ // delete from contact

      } else { // remove channel form
         var result = Enumerable
                    .From(vm.contact.contactChannels)
                    .Where(function(i){return i.uuid == channel.uuid;})
                    .SingleOrDefault();
         for (var i = 0; i < vm.contact.contactChannels.length; i++) {
            if(channel.uuid === vm.contact.contactChannels[i].uuid){
                vm.contact.contactChannels.splice(i, 1);
                break;
            }
          }
      }
    }
  }
})();