'use strict';

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if(process.env.NODE_ENV === 'production') {
  // initialize sessions with settings for production
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
    mongooseConnection: db.Mongoose.connection
  }) // if do not specify, it will save in memory, which will not scale and will kill the servers
});
} else {
  module.exports = session({
    // initialize sessions with settings for dev
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  });
}
