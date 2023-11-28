const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const communityRoutes = require('./routes/communityRoutes');
const userRoutes = require('./routes/userRoutes');
const user = require('./models/user');
const posts = require('./routes/post');
const session = require('express-session');
const flash = require('connect-flash');
const { request } = require("express");
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const Post = require('./models/post');
var myApp = express();

myApp.use(mongoSanitize({
    replaceWith: '_'
}))
// connecting the db
mongoose.connect('mongodb://127.0.0.1:27017/CommuniHubData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//checking for success in database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection Successful");
});


// Creating an instance of the Express application
//body parser
myApp.use(express.urlencoded({ extended: false }));
//defining the session- config
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
// Middleware to parse JSON and form data
myApp.use(bodyParser.json());
myApp.use(bodyParser.urlencoded({ extended: true }))
myApp.use(session(sessionConfig));
myApp.use(passport.initialize());
myApp.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
myApp.use(flash());
// Middleware for flash
myApp.use((req, res, next) => {
    res.locals.CurrentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



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

myApp.use(communityRoutes);
myApp.use(userRoutes);
myApp.use(posts);

//Home route
myApp.get('/', (req, res) => {
    res.render('home');
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

myApp.get('/dashboard', async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;

    console.log(req.session);

    if (isLoggedIn) {
        try {
            // Fetch all posts from the database
            const posts = await Post.find().populate('user');

            // Render an HTML page to display the posts
            res.render('dashboard', { posts });
        } catch (error) {
            // Handle errors (e.g., database connection issues)
            res.status(500).send('Error: ' + error.message);
        }

    } else {
        res.redirect('/login');
    }
});



myApp.get('/about', function (req, res) {
    res.render('about');
});

myApp.get('/services', function (req, res) {
    res.render('services');
});

myApp.get('/createEvent', (req, res) => {
    res.render('createEvent');
})

myApp.get('/createProject', (req, res) => {
    res.render('createProject');
})

myApp.get((req, res) => {
    res.status(404).render();
    //render the error page here
})

// Starting the server on port 8080
myApp.listen(8080);

console.log('Everything executed fine.. website at port 8080....');