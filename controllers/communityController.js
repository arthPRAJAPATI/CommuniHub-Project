const Community = require('../models/community');

exports.getLoginView = function (req, res) {
    res.render('communityLogin', { community : false, user: false, home: true })
};

exports.postLogin = function (req, res) {
    const { username, password } = req.body;

    // Authenticate user
    Community.findOne().then((community) => {
        req.session.username = community.name;
        req.session.isLoggedIn = true;
        res.redirect('/communityDashboard');
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
};

exports.getSignupView = function (req, res) {
    res.render('communitySignup', { community : false, user: false, home: true });
};

