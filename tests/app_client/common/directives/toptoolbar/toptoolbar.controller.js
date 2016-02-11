(function () {

  angular
    .module('salesHubApp')
    .controller('toptoolbarCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$window', '$location', '$uibModal', 'accounts', 'featureToggle'];
  function navigationCtrl($window, $location, $uibModal, accounts, featureToggle) {
    var vm = this;

    //console.log(featureToggle.isEnabled('searchLead'));
    // Features
    vm.isSearchLead = featureToggle.isEnabled('searchLead');

    vm.currentPath = $location.path();

    vm.isLoggedIn = accounts.isLoggedIn();

    vm.currentUser = {};
    accounts.getCurrentUser(function(success, data){
      if(success){
        vm.currentUser = data;
      }else{
        //$location.path('/');
        //accounts.logout();
        $window.location = '/';
      }
    });

    //vm.currentUser = accounts.getCurrentUser();
    //console.log(vm.currentUser);

    vm.logout = function() {
      accounts.logout();
      //$location.path('/');
      $window.location = '/';
    };

    vm.newLead = function(){
       var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: './leads/newlead/newlead.view.html',
          controller: 'newleadCtrl',
          controllerAs: 'vm',
          size: 'md',
          resolve: {
            
          }
       });
    };
  }
})();