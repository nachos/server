/**
 * Logger
 */

'use strict';
var bunyan = require('bunyan');

function createLogger() {
  return bunyan.createLogger({
    name: 'Nachos',
    src: true,
    serializers: {
      req: bunyan.stdSerializers.req,
      err: bunyan.stdSerializers.err
    },
    streams: [
      {
        level: 'info',
        stream: process.stdout
      },
      {
        level: 'error',
        path: 'errors.log'
      }
    ]
  });
}

module.exports = createLogger();