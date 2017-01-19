'use strict';
const winston = require('winston');

const logger = new (winston.Logger)({
  //similar as require('./winston/logger').Logger - but want to treat as a function
  transports: [
    new (winston.transports.File)({
      level: 'debug',
      filename: './chatCatDebug.log',
      handleExceptions: true // log other errors that we are not purposely following
    }),
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      handleExceptions: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
