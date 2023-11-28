const mongoose = require('mongoose');

const Event = mongoose.model('Event', new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    tags: [String],
    Community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Community
    },
    RegisteredUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }]
}))

module.exports = Event;