(function () {

  angular
    .module('salesHubApp')
    .controller('toptoolbarCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$window', '$location', '$uibModal', 'accounts'];
  function navigationCtrl($window, $location, $uibModal, accounts) {
    var vm = this;

    // Features
    vm.searchFeature = false;

    vm.currentPath = $location.path();

    vm.isLoggedIn = accounts.isLoggedIn();

    vm.currentUser = {};
    accounts.getCurrentUser(function(data){
      vm.currentUser = data;
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