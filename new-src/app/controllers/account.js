/* GET 'about' page */
module.exports.login = function(req, res){
  res.render('account-login', { 
  	title: 'Sales Hub',
  	foo: function(){
  		alert('5555');
  	}
  });
};