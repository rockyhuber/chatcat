'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);


// log an error if the connection fails
Mongoose.connection.on('error', error => {
  console.log("MongoDb error: ", error);
});

// create a schema that defines the structure for storing user data
const chatUser = new Mongoose.Schema({
  profileID: String,
  fullName: String,
  profilePic: String
});

// turn schema into a user model
let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
  Mongoose,
  userModel
}
