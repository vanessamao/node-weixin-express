'use strict';
module.exports = function (values, flags) {
  var id = flags['id'] || process.env.APP_ID || 'ID';
  var secret = flags['secret'] || process.env.APP_SECRET || 'SECRET';
  var token = flags['token'] || process.env.APP_TOKEN || 'TOKEN';
  var host = flags['host'] || process.env.HOST || 'http://localhost';
  var app = {
    id: id,
    secret: secret,
    token: token
  };

  var urls = {
    access: host + '/weixin/oauth/access',
    success: host + '/weixin/oauth/success'
  };

  var express = require('express');
  var bodyParser = require('body-parser');

  var http = express();

  http.use(bodyParser.urlencoded({ extended: false }));
  http.use(bodyParser.json());

  //Init auth
  var auths = require('./routes/auth');
  for(var key in auths) {
    http.get(key, auths[key](token)).post(key, auths[key](token));
  }


  //Init oauth
  var oauths = require('./routes/oauth');
  function onOauthSuccess() {
    console.log("success fully on oauth");
  }

  for(var k in oauths) {
    http.get(k, oauths[k](app, urls, onOauthSuccess)).post(k, oauths[k](app, urls, onOauthSuccess));
  }
  return http;
};
