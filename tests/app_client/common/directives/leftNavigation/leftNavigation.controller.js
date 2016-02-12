(function () {

  angular
    .module('salesHubApp')
    .controller('leftNavigationCtrl', leftNavigationCtrl);

  leftNavigationCtrl.$inject = ['$location', 'accounts', 'featureToggle'];
  function leftNavigationCtrl($location, accounts, featureToggle) {
    var vm = this;

    vm.isHome = featureToggle.isEnabled('home');

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