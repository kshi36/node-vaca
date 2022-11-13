/**
 * App setup & server setup
 */

// node modules
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var params = require('./params/params');
var setUpPassport = require('./setuppassport');

// setup express app
var app = express();

// connect to MongoDB db
mongoose.connect(params.DATABASECONNECTION);

// set up passport
setUpPassport();

// set port
app.set('port', process.env.PORT || 3000);

// set views & view engine (templating)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');      //use ejs templating

// use parsers
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// use session
app.use(session({
    secret:'ewfz)Ifn0b8b@9Ue98*V7fna@*bfhmpaw',    //secret key to secure
    resave:false,
    saveUninitialized:false
}));

// serve static files from path "/public"
// app.use('/public', express.static(__dirname + '/public'));
// app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// use passport
app.use(passport.initialize());
app.use(passport.session());

// use flash
app.use(flash());

// use router for routing
app.use('/', require('./routes'));      //refers to index.js file

// listen to http server?
app.listen(app.get('port'), function(){
    console.log("Server started on port " + app.get('port'));
});