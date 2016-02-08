require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');

require('./app_api/controllers/_const');
require('./app_api/models/db');
require('./app_api/models/dbs');

//var accountsPage = require('./app_server/routes/accounts');
var accountsApi = require('./app_api/routes/accounts');
var organizationsApi = require('./app_api/routes/organizations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

var appClientFiles = [
    'app_client/app.js',
    'app_client/appRoutes.js',

    'app_client/lib/services/warehouse.js',
    'app_client/lib/services/localstorage.js',

    'app_client/lib/controllers/logincontroller.js',
    'app_client/lib/controllers/forgotcontroller.js',
    'app_client/lib/controllers/registercontroller.js',
    'app_client/lib/controllers/invitationscontroller.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : true });
fs.writeFile('public/salesHubApp.min.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'salesHubApp.min.js');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//app.use('/', accountsPage);
app.use('/api', accountsApi);
app.use('/api', organizationsApi);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;