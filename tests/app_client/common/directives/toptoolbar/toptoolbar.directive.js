(function () {

  angular
    .module('salesHubApp')
    .directive('toptoolbar', toptoolbar);

  function toptoolbar () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/toptoolbar/toptoolbar.template.html',
      controller: 'toptoolbarCtrl as ttbarvm'
    };
  }

})();