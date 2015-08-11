'use strict';

module.exports = {
  ip: process.env.IP || undefined,
  port: process.env.PORT || 8080,
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/nachos'
  },
  requireSSL: false
};