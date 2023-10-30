const express = require('express'); // Importing Express framework
const path = require('path'); // Importing path module for working with file and directory paths

// set up expess validator
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cheerio = require('cheerio');

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

const Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    content: String,
    image: String, // Store the image as a URL
    // User: User.id
}))

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Store images in 'public/uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});
const upload = multer({ storage });

// Creating an instance of the Express application
var myApp = express();

//body parser
myApp.use(express.urlencoded({ extended: false }));
// Middleware to parse JSON and form data
myApp.use(bodyParser.json());
myApp.use(bodyParser.urlencoded({ extended: true }));
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
        res.redirect('/dashboard');
    })
    // if (isValidUser(username, password)) {
    //     req.session.isLoggedIn = true;
    //     req.session.username = username;
    //
    //     res.redirect('/dashboard');
    // } else {
    //     res.redirect('/login');
    // }
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

myApp.get('/dashboard',async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;

    if (isLoggedIn) {
        try {
            // Fetch all posts from the database
            const posts = await Post.find();
            
            // Render an HTML page to display the posts
            res.render('dashboard', { username,posts });
        } catch (error) {
            // Handle errors (e.g., database connection issues)
            res.status(500).send('Error: ' + error.message);
        }

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
 myApp.get('/createPost', function (req, res) {
     res.render('createPost');
 })

// Define a route to handle form submissions with image upload
myApp.post('/createPost', upload.single('image'), async (req, res) => {
    try {
        // Create a new post based on the form data, including the image URL
        const newPost = new Post({
            title: req.body.title,
            content: req.body.editorContent,
            image: req.file.filename, // Use the uploaded image's filename
            // User:
        });

        // Save the post to the database
        await newPost.save();

        // Redirect to a success page or perform other actions as needed
        res.redirect('/dashboard');
    } catch (error) {
        // Handle errors (e.g., validation errors or database connection issues)
        res.status(500).send('Error: ' + error.message);
    }
});

// Starting the server on port 8080
myApp.listen(8080);

console.log('Everything executed fine.. website at port 8080....');