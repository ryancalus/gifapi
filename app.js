/**
 * Module dependencies.
 */
var express = require('express');
var basicAuth = require('basic-auth');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var User = require('./models/User');

/**
 * Controllers (route handlers).
 */
var apiController = require('./controllers/api');


/**
 * Create Express server.
 */
var app = express();


/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://localhost:27017/giphyapiusers');
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());


/**
* Configure auth
*/
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };
  User.findOne({ username: user.name, password: user.pass}, function(err, existingUser){
    if (existingUser) return next();
    return unauthorized(res);
  });
};


/**
 * API examples routes.
 */
app.get('/api/:q', auth, apiController.searchGiphy);

app.post('/api', apiController.postUser);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
