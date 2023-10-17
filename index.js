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

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
})

// Creating an instance of the Express application
var myApp = express();

//body parser
myApp.use(express.urlencoded({ extended: false }));

// setting up the session
myApp.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // session timeout of 60 seconds
}));

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
    res.render('login')
});

myApp.post('/login', function (req, res) {
    const { username, password } = req.body;

    // Authenticate user
    User.findOne().then((user) => {
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        res.render('adminHome', { title: title, page: 'loggedIn', pageType: 'admin' });
    })
    if (isValidUser(username, password)) {
        req.session.isLoggedIn = true;
        req.session.username = username;

        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
    // res.render('login');
});

myApp.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

myApp.get('/dashboard', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;

    if (isLoggedIn) {
        res.render('dashboard', { username });
    } else {
        res.redirect('/login');
    }
});


myApp.get('/userSignup', function (req, res) {
    res.render('userSignup');
});

myApp.post('/userSignup', function (req, res) {
    var newUserdata = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    //validate Username and email before save

    let newUser = new User(newUserdata);

    newUser.save();
    // show sucessful popup or error popup
    res.render('home');

});

myApp.get('/communitySignup', function (req, res) {
    res.render('communitySignup');
});

myApp.post('/communitySignup', function (req, res) {
    var Communitydata = {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        guideline: req.body.guideline
    };
    // validate community name and form data before save

    let community = new Community(Communitydata);

    community.save();

    // show the success or error popup
    res.render('index');

});

myApp.get('/about', function (req, res) {
    res.render('about');
});

myApp.get('/services', function (req, res) {
    res.render('services');
});

// Starting the server on port 8080
myApp.listen(8080);

console.log('Everything executed fine.. website at port 8080....');