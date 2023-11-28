const mongoose = require('mongoose');

const Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    upvotes: Number,
    downvotes: Number
}))

module.exports = Post;