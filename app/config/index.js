'use strict';

if(process.env.NODE_ENV === 'production') {
  // offer production stage environmental variables

  let redisURI = require(url).parse(process.env.REDIS_URL);
  let redisPassword = redisURI.auth.split(':')[1];

  module.exports = {
      host: process.env.host || "",
      dbURI: process.env.dbURI,
      sessionSecret: process.env.sessionSecret,
      fb: {
        clientID: process.env.fbClientID,
        clientSecret: process.env.fbClientSecret,
        callbackURL: process.env.host + "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos'],
        fbIs: "facebook"
      },
      twitter: {
        consumerKey: process.env.twConsumerKey,
        consumerSecret: proces.env.twConsumerSecret,
        callbackURL: process.env.host + "/auth/twitter/callback",
        profileFields: ['id', 'displayName', 'photos'],
        twitterIs: "twitter"
      },
      redis: {
        host: redisURI.hostname,
        port: redisURI.port,
        password: redisPassword
      }
  }
} else {
  // offer dev settings and data
  module.exports = require('./development.json');
}
