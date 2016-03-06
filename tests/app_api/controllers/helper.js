module.exports.sendJsonResponse = function(res, status, content) {
	res.status(status);
  	res.json(content);
}

Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}