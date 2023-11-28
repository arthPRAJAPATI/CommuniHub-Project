const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const {plugin} = require("mongoose");

// creating db model:
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String
}).plugin(passportLocalMongoose))

module.exports = User;