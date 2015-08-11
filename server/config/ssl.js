'use strict';

// Set up SSL
var fs = require('fs');
var https = require('https');

var credentials = {
  key: fs.readFileSync('server/config/certs/server.key'),
  cert: fs.readFileSync('server/config/certs/server.crt')
};

module.exports = function (app) {
  return https.createServer(credentials, app);
};