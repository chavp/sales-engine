(function () {

  angular
    .module('salesHubApp')
    .controller('toptoolbarCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'accounts'];
  function navigationCtrl($location, accounts) {
    var vm = this;

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
      $location.path('/');
    };

  }
})();