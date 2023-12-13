const mongoose = require('mongoose');


const tag = mongoose.model('tag', new mongoose.Schema({
    name: String,
    count: {
        type: Number,
        default: 1
    }
}))

module.exports = tag;