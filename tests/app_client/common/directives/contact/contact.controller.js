(function () {

  angular
    .module('salesHubApp')
    .controller('contactCtrl', contactCtrl);

  contactCtrl.$inject = ['$scope', '$rootScope', '$location', 'leads', 'featureToggle'];
  function contactCtrl($scope, $rootScope, $location, leads, featureToggle) {
    var vm = this;

    vm.uuid = $scope.contact.uuid;
    vm.contact = $scope.contact;
    vm.oldContact = {
        name: vm.contact.name,
        title: vm.contact.title
    };

    vm.isEditing = true;
    vm.isEmpaty = function(){
      if(vm.contact._id) return false;
      return true;
    };
    if(vm.contact._id) {
      vm.isEditing = false;
    }

    vm.save = function(){
      vm.saving = true;
       if(!vm.contact._id) { // save
        //console.log("Save");
         leads.saveLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 
            vm.contact._id = result._id;

            vm.isEditing = false;
            
         });
       } else { // update
          //console.log("Update");
          leads.updateLeadContact(vm.contact, function(err, result){
            vm.saving = false;
            if(err) return false;
            //console.log(result); 

            // update lead
            vm.isEditing = false;
         });
       }
    }

    vm.edit = function(){
      vm.isEditing = true;
    }

    vm.cancle = function(){
      vm.isEditing = false;
      if(vm.contact._id){
        //console.log(vm.contact);
        //console.log(vm.oldContact);
        vm.contact.name = vm.oldContact.name;
        vm.contact.title = vm.oldContact.title;
      }
      $rootScope.$emit("refreshLead_event", {
        uuid: vm.uuid
      });
    }
  }
})();