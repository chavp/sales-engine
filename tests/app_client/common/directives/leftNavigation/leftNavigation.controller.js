(function () {

  angular
    .module('salesHubApp')
    .controller('leftNavigationCtrl', leftNavigationCtrl);

  leftNavigationCtrl.$inject = ['$location', 'accounts'];
  function leftNavigationCtrl($location, accounts) {
    var vm = this;

    vm.currentPath = $location.path();
    vm.isLoggedIn = accounts.isLoggedIn();

    vm.getClass = function (path) {
	  if ($location.path().substr(0, path.length) === path) {
	    return 'active';
	  } else {
	    return '';
	  }
	}
  }
})();