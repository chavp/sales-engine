var mongoose = require('mongoose');
var helper = require('./helper');

var open = require('amqplib')
	.connect(process.env.RABBITMQ_BIGWIG_TX_URL);

var q = 'webhook-compose',
    q_error = 'webhook-compose-error';

// Consumer
open.then(function(conn) {
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
  	ch.assertQueue(q_error);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        //console.log(msg.content.toString());
        saveEventEmail(msg, function(err){
        	if(err) {
        		ch.sendToQueue(q_error, new Buffer(msg.content));
        	}
        	ch.ack(msg);
        });


      }
    });
  });
  return ok;
}).then(null, console.warn);

var saveEventEmail = function(msg, cb){
	//console.log("processing... " + msg.content);

	try {
	    var cont = JSON.parse(msg.content);
		var comppose = new Compose({
			from: cont.From,
			to: cont.To
		});
		console.log("from: " + comppose.from + ", to: " + comppose.to + " completed!");
		cb();
	  } catch (err) {
	  	console.error(err);
	  	// Publisher
		/*open.then(function(conn) {
		  var ok = conn.createChannel();
		  ok = ok.then(function(ch) {
		    ch.assertQueue(q_error);
		    ch.sendToQueue(q_error, new Buffer(msg.content));
		  });
		  return ok;
		}).then(null, console.warn);
		ch.ack(msg);*/
		cb(err);
	    //return console.error(err);
	 }
}


// POST callback
module.exports.callback = function(req, res){
	console.log('POST callback', req.body);
	
	var mailgunForward = new MailgunForward({
		body: JSON.stringify(req.body),
		params: JSON.stringify(req.params)
	});

	mailgunForward.save(function(err){
		helper.sendJsonResponse(res, OK, 
			{ "message": "Save forward mail completed." }
		);
	});
}

// POST callback
module.exports.messages = function(req, res){
	console.log('POST callback', req.body);
	
	var mailgunForward = new MailgunForward({
		body: JSON.stringify(req.body),
		params: JSON.stringify(req.params)
	});

	mailgunForward.save(function(err){

		// notify rabbit for parser

		helper.sendJsonResponse(res, OK, 
			{ "message": "Save forward mail completed." }
		);
	});
}