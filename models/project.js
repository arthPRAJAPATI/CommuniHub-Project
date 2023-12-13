const mongoose = require('mongoose');


const Project = mongoose.model('Project', new mongoose.Schema({
    name: String,
    description: String,
    tags: [String],
    Community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    InvitedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}))

module.exports = Project;