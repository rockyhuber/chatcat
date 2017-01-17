'use strict';
const router = require('express').Router();
const h = require('../helpers');
const passport = require('passport');
const config = require('../config');


module.exports = () => {
  let routes = {
    'get': {
      '/': (req, res, next) => {
        res.render('login');
      },
      '/rooms': [h.isAuthenticated, (req, res, next) => { // if authenticated move to the next function in the array
        res.render('rooms', { // express allows for arrays in the routes
          user: req.user,
          host: config.host
        });
      }],
      '/chat/:id': [h.isAuthenticated, (req, res, next) => {
        // Find a chat room with a given ID
        // Render it if the id is found
        let getRoom = h.findRoomByID(req.app.locals.chatrooms, req.params.id);
        console.log(getRoom);
        if(getRoom === undefined) {
          return next();
        } else {
            res.render('chatroom', {
              user: req.user,
              host: config.host,
              room: getRoom.room,
              roomID: getRoom.roomID
            });
        }

      }],
      '/getsession': (req, res, next) => {
        res.send("My favourite colour: " + req.session.favColor);
      },
      '/setsession': (req, res, next) => {
        req.session.favColor = "Red";
        res.send("Session has been set");
      },
      '/auth/facebook': passport.authenticate('facebook'),
      '/auth/facebook/callback': passport.authenticate('facebook', {
        successRedirect: '/rooms',
        failureRedirect: '/'
      }),
      '/auth/twitter': passport.authenticate('twitter'),
      '/auth/twitter/callback': passport.authenticate('twitter', {
        successRedirect: '/rooms',
        failureRedirect: '/'
      }),
      '/logout': (req, res, next) => {
        req.logout();
        res.redirect('/');
      }
    },
    'post': {

    },
    'NA': (req, res, next) => {
      res.status(404).sendFile(process.cwd() + '/views/404.htm'); // absolute path to folder that contains server.js
    }
}

return h.route(routes);

}
