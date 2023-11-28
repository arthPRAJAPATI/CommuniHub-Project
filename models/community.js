const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// creating db model:
const Community = mongoose.model('Community', new mongoose.Schema({
    name: String,
    location: String,
    description: String,
    guideline: String,
    password: String
}).plugin(passportLocalMongoose));

module.exports = Community;