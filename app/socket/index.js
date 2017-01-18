'use strict';
const h = require('../helpers');


module.exports = (io, app) => {
  let allrooms = app.locals.chatrooms;

  // allrooms.push({
  //   room: 'Good Food',
  //   roomID: '0001',
  //   user: []
  // });
  //
  // allrooms.push({
  //   room: 'Cloud computing',
  //   roomID: '0002',
  //   users: []
  // });



  io.of('/roomslist').on('connection', socket => { // on is an event listener. get an instance to the socket of the user who loggged in.
      // console.log("Socket.io connected to the client");
      socket.on('getChatrooms', () => {
        socket.emit('chatRoomsList', JSON.stringify(allrooms));
      });

      socket.on('createNewRoom', newRoomInput => {
        // console.log(newRoomInput);
        // check to see if a room with the same title exists
        // if not then create one and broadcast out to everyone
        if(!h.findRoomByName(allrooms, newRoomInput)) {
          allrooms.push({
            room: newRoomInput,
            roomID: h.randomHex(),
            users: []
          });

          // emit an updated list to the person who created the chatrooms
          socket.emit('chatRoomsList', JSON.stringify(allrooms));
          // emit to everyone who is part
          socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms)); // sends charooms list to all connected sockets in the rooms list names space
        }
      });
  });

  io.of('/chatter').on('connection', socket => {
    socket.on('join', data => {
      // console.log("there", data);
      let usersList = h.addUserToRoom(allrooms, data, socket);
      // console.log("here", usersList);
      // console.log("data", data);
      // update the list of active users as shown on the chatroom page
      socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
      socket.emit('updateUsersList', JSON.stringify(usersList.users));
      // socket.to -- same effect as above
    });

    // when a socket exits
    socket.on('disconnect', () => {
      // find the room, to which the socket is connected and purge the user
      let room = h.removeUserFromRoom(allrooms, socket);
      // console.log(room.users);
      socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
    });

    socket.on('newMessage', data => {
      socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });

  });


}
