const express = require('express'); // Importing Express framework
const path = require('path'); // Importing path module for working with file and directory paths

// set up expess validator
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Requiring the session package
const session = require('express-session');

// connecting the db
mongoose.connect('mongodb://127.0.0.1:27017/CommuniHubData');

// creating db model:
const Community = mongoose.model('Community', {
    name: String,
    location: String,
    description: String,
    guideline: String
})


// Creating an instance of the Express application
var myApp = express();

//body parser
myApp.use(express.urlencoded({ extended: false }));

// setting up the session

// Configuring the app's view engine to use EJS for rendering views
myApp.set('views', path.join(__dirname, 'views'));
myApp.set('view engine', 'ejs');

myApp.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
)
myApp.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
)
myApp.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")))



// Serving static files from the 'public' directory
myApp.use(express.static(__dirname + '/public'));

//Home route
myApp.get('/', function (req, res) {
    res.render('home');
});

myApp.get('/login', function (req, res) {
    res.render('login');
});

myApp.get('/userSignup', function (req, res) {
    res.render('userSignup');
});

myApp.get('/communitySignup', function (req, res) {
    res.render('communitySignup');
});


myApp.post('/', function (req, res) {
    var Communitydata = {
        name: req.body.name,
        location: req.body.location,
        description: req.body, description,
        guideline: req.body.guideline
    };

    let community = new Community(Communitydata);

    community.save();

    res.render('index');

});

// Starting the server on port 8080
myApp.listen(8080);

console.log('Everything executed fine.. website at port 8080....');