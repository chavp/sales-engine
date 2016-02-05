
// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var api = require('./app/routes')(app, express);
var warehouse = require('./app/warehouse')(app, express);
var db = require('./config/config');
// configuration ===========================================
// config files
// check data conection
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
var port = process.env.PORT || 80;

mongoose.connect(db.url, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected  to  database ');
    }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get('/inbox', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/dashboard.html'));
});
app.use('/warehouse', warehouse);
app.use('/api', warehouse);
// set our port
app.listen(port);
// shoutout to the user                     
console.log('You Are Welcome  on port ' + port);
