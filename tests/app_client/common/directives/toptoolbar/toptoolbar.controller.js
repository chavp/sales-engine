(function () {

  angular
    .module('salesHubApp')
    .controller('toptoolbarCtrl', navigationCtrl);

  navigationCtrl.$inject = [
    '$window', '$location', '$log', '$uibModal', 'accounts', 'featureToggle'
  ];
  function navigationCtrl($window, $location, $log, $uibModal, accounts, featureToggle) {
    var vm = this;

    //console.log(featureToggle.isEnabled('searchLead'));
    // Features
    vm.isSearchLead = featureToggle.isEnabled('searchLead');

    vm.currentPath = $location.path();

    vm.isLoggedIn = accounts.isLoggedIn();

    vm.currentUser = {};
    accounts.getCurrentUser(function(err, data){
      if(!err){
        vm.currentUser = data;
      }else{
        //$location.path('/');
        accounts.logout();
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
          templateUrl: '../../leads/newlead/newlead.view.html',
          controller: 'newleadCtrl',
          controllerAs: 'vm',
          size: 'md'
       });

       modalInstance.result.then(function(result){
          $log.info('result.message : ' + result.message);
          // save newitem

       }, function(){
          $log.info('Modal dismissed at: ' + new Date());
       });
    };
  }
})();