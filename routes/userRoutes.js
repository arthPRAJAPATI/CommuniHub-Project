const express = require('express');
const User = require('../models/user');
const Passport = require('passport');
const router = express.Router();


router.get('/login', function (req, res) {
    res.render('login', { community : false, user: false, home: true })
});

router.post('/login', function (req, res) {
    // const redirectUrl = req.session.returnTo || '/dashboard';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    const { username, password } = req.body;

    // Authenticate user
    User.findOne().then((user) => {
        req.session.username = user.name;
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


router.get('/userSignup', function (req, res) {
    res.render('userSignup', { community : false, user: false, home: true });
});

router.post('/userSignup', function (req, res) {
    var newUserdata = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    //validate Username and email before save


    let newUser = new User(newUserdata);

    newUser.save();
    // show sucessful popup or error popup
    res.render('home', { posts, community : false, user: false, home: true });

});


module.exports = router;