(function () {

  angular
    .module('salesHubApp')
    .controller('leftNavigationCtrl', leftNavigationCtrl);

  leftNavigationCtrl.$inject = ['$location'];
  function leftNavigationCtrl($location) {
    var vm = this;

    vm.currentPath = $location.path();

    
  }
})();