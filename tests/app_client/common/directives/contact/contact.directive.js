(function () {

  angular
    .module('salesHubApp')
    .directive('contact', contact);

  function contact () {
    return {
      restrict: 'EA',
      scope: {
        contact : '=data'
      },
      templateUrl: '/common/directives/contact/contact.template.html',
      controller: 'contactCtrl as convm'
    };
  }

})();