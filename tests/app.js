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

require('./app_api/config/passport');

//var accountsPage = require('./app_server/routes/accounts');
var accountsApi = require('./app_api/routes/accounts');
var organizationsApi = require('./app_api/routes/organizations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

/*var appClientFiles = [
  'app/app.js',
  'app/home/home.controller.js',
  'app/about/about.controller.js',
  'app/auth/login/login.controller.js',
  'app/auth/register/register.controller.js',
  'app/locationDetail/locationDetail.controller.js',
  'app/reviewModal/reviewModal.controller.js',
  'app/common/services/authentication.service.js',
  'app/common/services/geolocation.service.js',
  'app/common/services/loc8rData.service.js',
  'app/common/filters/formatDistance.filter.js',
  'app/common/filters/addHtmlLineBreaks.filter.js',
  'app/common/directives/navigation/navigation.controller.js',
  'app/common/directives/navigation/navigation.directive.js',
  'app/common/directives/footerGeneric/footerGeneric.directive.js',
  'app/common/directives/pageHeader/pageHeader.directive.js',
  'app/common/directives/ratingStars/ratingStars.directive.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });

fs.writeFile('public/angular/loc8r.min.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log("Script generated and saved:", 'loc8r.min.js');
  }
});*/

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//app.use(passport.initialize());

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
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

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