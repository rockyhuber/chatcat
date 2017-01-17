  'use strict';
const express = require('express');
const app = express();
const chatCat = require('./app');
const passport = require('passport');

app.set('port', process.env.PORT || 3000);
let port = app.get('port');
// app.set('views', './views')
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(chatCat.session); // has to appear before the router function
app.use(passport.initialize());
app.use(passport.session());

app.use('/', chatCat.router);

// app.listen(port, () => {
//   console.log('App running on port :' + port);
// })

chatCat.ioServer(app).listen(port, () => { // with socket.io
  console.log('App running on port :' + port);
})
