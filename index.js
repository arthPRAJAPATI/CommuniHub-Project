const express = require('express'); // Importing Express framework
const path = require('path'); // Importing path module for working with file and directory paths

// set up expess validator
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Requiring the session package
const session = require('express-session');

// connecting the db
// mongoose.connect('mongodb://127.0.0.1:27017/'); 

// creating db model:


// Creating an instance of the Express application
var myApp = express();

//body parser
myApp.use(express.urlencoded({ extended: false }));

// setting up the session

// Configuring the app's view engine to use EJS for rendering views
myApp.set('views', path.join(__dirname, 'views'));
myApp.set('view engine', 'ejs');


// Serving static files from the 'public' directory
myApp.use(express.static(__dirname + '/public'));

//Home route
myApp.get('/', function (req, res) {
    res.send('hello');
});

// Starting the server on port 8080
myApp.listen(8080);

console.log('Everything executed fine.. website at port 8080....');