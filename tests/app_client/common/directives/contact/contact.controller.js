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

    var cloneContactChannel = function(src, desc){
      for (var i = 0; i < src.contactChannels.length; i++) {
        desc.contactChannels.push({
          _id: src.contactChannels[i]._id,
          name: src.contactChannels[i].name,
          type: src.contactChannels[i].type
        });
      }
    }

    vm.phonePrefix = "+66";

    vm.canEdit = false;
    vm.showEdit = function(){
      vm.canEdit = true;
      return vm.canEdit;
    }

    vm.hideEdit = function(){
      vm.canEdit = false;
      return vm.canEdit;
    }

    // inint uuid
    initGuid(vm.contact.contactChannels);

    cloneContactChannel(vm.contact, vm.oldContact);

    /*vm.contactChanels.push({
      _id: guid(),
      name: "0812598962",
      type: "Mobile"
    });*/

    var mem = function(data){
      vm.oldContact.name = data.name;
      vm.oldContact.title = data.title;
      //console.log(data);
      clearAllArray(vm.oldContact.contactChannels);
      clearAllArray(vm.contact.contactChannels);
      cloneContactChannel(data, vm.oldContact);
      cloneContactChannel(data, vm.contact);
      //vm.oldContact.contactChannels = data.contactChannels;
    }

    var back = function(data){
      vm.contact.name = data.name;
      vm.contact.title = data.title;
      //vm.contact.contactChannels = data.contactChannels;
      //console.log(data.contactChannels);
      for (var i = 0; i < vm.contact.contactChannels.length; i++) {
        if(vm.contact.contactChannels[i]._id) {
          var result = Enumerable
                      .From(data.contactChannels)
                      .Where(function(x){return x._id == data.contactChannels[i]._id;})
                      .SingleOrDefault();
          vm.contact.contactChannels[i].name = result.name;
          vm.contact.contactChannels[i].type = result.type; 
        } 
      };

      clearContactChnannel();
    }

    var clearContactChnannel = function(){
      for (var i = vm.contact.contactChannels.length-1; i >= 0; --i) {
        //console.log(i);
        if(!vm.contact.contactChannels[i]._id)
          vm.contact.contactChannels.splice(i, 1);
      }
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

    vm.canEmail = function(){
      vm.contact.email = null;
      for (var i = 0; i <  vm.contact.contactChannels.length; i++) {
        var name = vm.contact.contactChannels[i].name;
        if(validateEmail(name)) {
          vm.contact.email = name;
          break;
        }
      }
      return vm.contact.email != null || vm.contact.email != undefined;
    }

    vm.canCall = function(){
      vm.contact.phone = null;
      for (var i = 0; i <  vm.contact.contactChannels.length; i++) {
        var name = vm.contact.contactChannels[i].name;
        if(validatePhone(name)) {
          vm.contact.phone = vm.phonePrefix + " " + name;
          break;
        }
      }
      return vm.contact.phone != null || vm.contact.phone != undefined;
    }

    vm.save = function(){
      vm.saving = true;
      $log.debug(vm.contact);
       if(!vm.contact._id) { // save
        //console.log("Save");
         //console.log(vm.contact);

         leads.saveLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 
            vm.contact._id = result._id;

            mem(result);
            initGuid(vm.contact.contactChannels);

            vm.isEditing = false;
            
          });
        } else { // update
          //console.log("Update");
          leads.updateLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 
            mem(result);
            initGuid(vm.contact.contactChannels);

            clearContactChnannel();
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

      leads.deleteLeadContact(vm.contact._id, function(err, result){
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
          leads.deleteContactChannel(channel._id, function(err, result){
             if(err) return false;
             removeByUuid(vm.contact.contactChannels, channel.uuid);
          })
      } else { // remove channel form
          removeByUuid(vm.contact.contactChannels, channel.uuid);
      }
    }
  }
})();