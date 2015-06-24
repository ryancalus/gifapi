
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var request = require('request');
var _ = require('lodash');
var User = require('../models/User');


/**
 * GET /api
 * List of API examples.
 */
exports.searchGiphy = function(req, res) {
  User.findOne({ username: req.body.username, password: req }, function(err, existingUser) {
    var query = querystring.stringify({ 's': req.params.q, 'api_key': 'dc6zaTOxFJmzC' });
    var url = 'http://api.giphy.com/v1/gifs/translate?' + query;
    request.get(url,  function(err, request, body) {
      if (err) return res.json(err);
      res.json(body);
     });
  });
};


exports.postUser = function(req, res) {
    req.assert('user', 'Username cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors)
    {
      res.status(400).send(_.forEach(errors, function(error){
        return error.msg;
      }));
      return;
    }  

    var user = new User({
      username: req.body.user,
      password: req.body.password
    });

    User.findOne({ username: req.body.user }, function(err, existingUser) {
      if (existingUser) {
        res.status(400).send({message: 'User exists'});
      }
      else{
        user.save(function(err) {
          if (err) 
            res.status(400).send({message: 'could not create user'});
          else
            res.sendStatus(200);
        });
      }
    });
}
