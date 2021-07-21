const express = require("express");
var path = require('path');

const app = express();
const distDir = path.join(__dirname, "public/");
const PORT = process.env.PORT || 8080;

function authentication(req, res, next) {
  var authheader = req.headers.authorization;

  if (!authheader) {
    console.log(req.path);

    var err = new Error('Not authenticated Error');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  if (user == 'admin' && pass == 'admin') {
    next();
  } else {
    var err = new Error('You are not authenticated!');
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