'use strict';
const router = require('express').Router();
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');


// social authentication
require('./auth')();

// create an IO server instance
let ioServer = app => {
  app.locals.chatrooms = []; // all users will be stored in memory. For scalability, need to look at last videos
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.set('transports', ['websocket']);

  let pubClient = redis(config.redis.port, config.redis.host, {
    auth_pass: config.redis.password
  });

  let subClient = redis(config.redis.port, config.redis.host, {
    return_buffers: true, // return the data as a buffer not as a string. It will stringify without this
    auth_pass: config.redis.password
  });

  io.adapter(adapter({
    pubClient,
    subClient
  }));

  // need session affinity


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
