var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser")
var session = require('express-session');
var app = express();

app.use(session({secret: 'caesar'}))
var plugintoSession = {
    secret: 'Shhhthisisasecret',
    resave: false, //<-- dont resave session if no changes made
    saveUnintialized: true,
    name: 'myCookie',
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 3600000
    }
}

app.use(session(plugintoSession))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const path = require('path')
app.use(express.static(path.join(__dirname,'public/dist')));

require('./server/config/mongoose');
require('./server/config/routes')(app);

app.all("*", (request, response, next)=>{
  response.sendfile(path.resolve("./public/dist/index.html"))
})

app.listen(8000, () =>
  console.log("listening on port 8000"))
