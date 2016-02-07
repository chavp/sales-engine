var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

/* GET 'Login' page */
module.exports.login = function(req, res){
  res.render('login', {
    title: "Login"
  });
};