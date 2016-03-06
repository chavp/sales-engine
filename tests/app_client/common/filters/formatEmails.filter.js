(function () {

  angular
    .module('salesHubApp')
    .filter('formatEmails', formatEmails);

  function formatEmails () {
    return function (emails) {
      //console.log(emails);
      var list = [];
      for (var i = 0; i < emails.length; i++) {
        if(emails[i].text)
          list.push(emails[i].text);
        else
          list.push(emails[i]);
      }
      //console.log(list);
      return list.join();
    };
  }
  
})();