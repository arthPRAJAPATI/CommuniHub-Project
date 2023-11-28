const mongoose = require('mongoose');

const userDetails = mongoose.model('userDetails', new mongoose.Schema({
    userID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }],
    communityFollowed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Community
    }],
    projectInvitee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Project
    }],
    eventRegistered: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: event
    }]
}))


module.exports = userDetails;