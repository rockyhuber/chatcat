'use strict';
const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

    // Itterate through the routes object and mount the routes
let _registerRoutes = (routes, method) => {
  for(let key in routes) { // only use to loop through objects, and not arrays
    if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      _registerRoutes(routes[key], key);
    } else {
      // Register the routes
      if(method === 'get') {
        router.get(key, routes[key]);
      } else if(method === 'post') {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
}

let route = routes => { // same as let route = (routes) => {
  _registerRoutes(routes);
  return router;
}

// find an id
let findOne = profileID => {
  return db.userModel.findOne({
    'profileID': profileID
  });
}

// create new user
let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || null
    });
    newChatUser.save(error => {
      if(error) {
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
}

let findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if(error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

let isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) { // passport provides this method
    next();
  } else {
    res.redirect('/');
  }
}

let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if(element.room === room) {
      return true;
    } else {
      return false;
    }
  });
  return findRoom > -1 ? true : false; // terniarry operator
}


// generate unique ID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

let findRoomByID = (allrooms, roomID) => {
  return allrooms.find((element, index, array) => {
    if(element.roomID === roomID) {
      return true;
    } else {
      return false;
    }
  });
}

let addUserToRoom = (allrooms, data, socket) => {
    // get the room object
    let getRoom = findRoomByID(allrooms, data.roomID)
    if(getRoom !== undefined) {
      // get the active user from the session cookie (object id). CAnt use socket id (always changes reconnect or reload). cant rely on name or profile pic as well
      let userID = socket.request.session.passport.user;
      // console.log(socket);
      // console.log("*************************");
      // console.log(socket.request);
      // console.log("*************************");
      // console.log(socket.request.session);
      // console.log("*************************");
      // console.log(socket.request.session.passport);
      // console.log("*************************");
      // console.log(socket.request.session.passport.user);
      // console.log("*************************");

      // check to see if user already exists in room or not
      let checkUser = getRoom.users.findIndex((element, index, array) => {
        if(element.userID === userID) {
          return true;
        } else {
          return false;
        }
      });
      // if a user is already present, remove him first
      if(checkUser > -1) {
        getRoom.users.splice(checkUser, 1);
      }
      // push user into array
      getRoom.users.push({
        socketID: socket.id,
        userID,
        user: data.user,
        userPic: data.userPic
      });
      // join the room channel
      socket.join(data.roomID);
      // return the updated room object
      return getRoom;
    }
}

let removeUserFromRoom = (allrooms, socket) => {
  for(let room of allrooms) {
    // find the user
    let findUser = room.users.findIndex((element, index, array) => {
      if(element.socketID === socket.id) {
        return true;
      } else {
        return false;
      }
      // or // return element.socketID === socketID $ true : false;
    });

    if(findUser > -1) {
      socket.leave(room.roomID);
      room.users.splice(findUser, 1);
      return room;
    }
  }
}

module.exports = {
  route,
  createNewUser,
  findOne,
  findById,
  isAuthenticated,
  findRoomByName,
  randomHex,
  findRoomByID,
  addUserToRoom,
  removeUserFromRoom
}
