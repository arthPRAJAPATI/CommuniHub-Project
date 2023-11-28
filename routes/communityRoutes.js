const express = require('express');
const CommunityController = require('../controllers/communityController');
const Community = require('../models/community');
const router = express.Router();


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
    res.render('login');

});

router.get('/communityDashboard', function (req, res) {
    res.render('communityDashboard');
});

module.exports = router;