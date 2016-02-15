(function () {

  angular
    .module('salesHubApp')
    .filter('formatContacts', formatContacts);

  function formatContacts () {
    return function (contacts) {
      if(contacts.length == 1){
        return contacts[0].name;
      } else if(contacts.length > 1){
        return contacts[0].name + " +" + (contacts.length - 1);
      }
      return "";
    };
  }


})();