'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            undefined,

  // Server port
  port:     process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGO_URI || 'mongodb://localhost/nachos'
  },

  // Should SSL be used
  requireSSL: false
};