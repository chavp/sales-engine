(function () {

  angular
    .module('salesHubApp')
    .directive('leftNavigation', leftNavigation);

  function leftNavigation () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/leftNavigation/leftNavigation.template.html',
      controller: 'leftNavigationCtrl as navvm'
    };
  }

})();