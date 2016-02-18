(function () {

  angular
    .module('salesHubApp')
    .directive('leadProfile', leadProfile);

  function leadProfile () {
    return {
      restrict: 'EA',
      scope: {
        lead : '=lead'
      },
      templateUrl: '/common/directives/leadProfile/leadProfile.template.html',
      controller: 'leadProfileCtrl as ledvm',
      link: function($scope, el, attrs){

        //console.log($scope.vm);
      }
    };
  }

})();