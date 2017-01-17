'use strict';
const router = require('express').Router();

// social authentication
require('./auth')();

// create an IO server instance
let ioServer = app => {
  app.locals.chatrooms = []; // all users will be stored in memory. For scalability, need to look at last videos
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.use((socket, next) => {
    require('./session')(socket.request, socket.request.res, next); // {} || socket.request.res
  });
  require('./socket')(io, app);
  return server;
}


module.exports = {
  router: require('./routes')(), // invoke the function
  session: require('./session'),
  ioServer
}
