(function () {

  angular
    .module('salesHubApp')
    .filter('formatCreatedAt', formatCreatedAt);

  function formatCreatedAt () {
    return function (createdAt) {
      if(!createdAt) return "";
      return $.timeago(createdAt);
    };
  }
  
})();