'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const logger = require('../logger');


module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => logger.log('error', "Error in deserializing user" + error));
  });


// although using same authProcesser, auth token different with twitter
// in twitters case, accessToken is token and refreshToken is tokenSecret
// but doesnt matter because it is a function

  let authProcesser = (accessToken, refreshToken, profile, done) => {
    // verify callback, find user profile in local mongodb profile.id
    // if user is found, return the user data using done()
    // if user is not found, create one in the local db
    h.findOne(profile.id)
      .then(result => {
        if(result) { // finds an ID
          done(null, result)
        } else {
          // create new user and return
          h.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => logger.log('error', "Error when creating new user!" + error))
        }
      });
  }

  passport.use(new FacebookStrategy(config.fb, authProcesser));
  passport.use(new TwitterStrategy(config.twitter, authProcesser));
}
