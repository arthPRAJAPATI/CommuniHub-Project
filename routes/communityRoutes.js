const express = require('express');
const CommunityController = require('../controllers/communityController');
const Community = require('../models/community');
const Post = require("../models/post");
const router = express.Router();
const Tags = require("../models/tag");
const Events = require("../models/event");

router.get('/communityLogin',CommunityController.getLoginView);

router.post('/communityLogin', CommunityController.postLogin);

router.get('/communitySignup', CommunityController.getSignupView);

router.post('/communitySignup', function (req, res) {
    var Communitydata = {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        guideline: req.body.guideline,
        password: req.body.password
    };
    // validate community name and form data before save

    let community = new Community(Communitydata);

    community.save();

    // show the success or error popup
    res.render('login', { community : false, user: false, home: true});

});

router.get('/communityDashboard', async function (req, res) {

    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;

    console.log(req.session);

    if (isLoggedIn) {
        try {
            // Fetch all posts from the database
            const events = await Events.find().populate('Community');
            const tags = await Tags.find().sort({ count: 1 });
            // Render an HTML page to display the posts
            res.render('communityDashboard', { community : true, user: false, home: false, tags, events });
        } catch (error) {
            // Handle errors (e.g., database connection issues)
            res.status(500).send('Error: ' + error.message);
        }

    } else {
        res.redirect('/login');
    }


});

module.exports = router;