const express = require("express");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

function authentication(req, res, next) {
  let authheader = req.headers.authorization;

  if (!authheader) {
    let err = new Error('Not authenticated Error');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  let auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
  let user = auth[0];
  let pass = auth[1];

  if (user == 'admin' && pass == 'admin') {
    next();
  } else {
    let err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

}

app.use(authentication);
app.use(express.static(path.join(__dirname, 'public')));



app.listen((PORT), () => {
  console.log("Server is Running  at http://localhost:" + PORT);
});