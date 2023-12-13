const express = require('express');
const multer = require('multer');
// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Store images in 'public/uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});
const upload = multer({ storage });
const router = express.Router();

const Community = require('../models/community')
const Post = require('../models/post');
const {isLoggedIn} = require("../middleware");
const Tags = require("../models/tag");
// router.get('/createPost', isLoggedIn, async function (req, res) {
    router.get('/createPost', async function (req, res) {
    const communityList = await Community.find();
    console.log(communityList);
    res.render('createPost', { community : false, user: true, home: false, communityList });
})

// Define a route to handle form submissions with image upload
router.post('/createPost', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body);
        // Create a new post based on the form data, including the image URL
        const newPost = new Post({
            title: req.body.title,
            content: req.body.editorContent,
            image: req.file.filename, // Use the uploaded image's filename
            tags: req.body.tags.split(',').map(tag => tag.trim()).map(tag => `#${tag}`),
            community: req.body.community
        });

        console.log(newPost);
        // Save the post to the database
        await newPost.save();
        await saveTags(newPost.tags);

        // Redirect to a success page or perform other actions as needed
        res.redirect('/dashboard');
    } catch (error) {
        // Handle errors (e.g., validation errors or database connection issues)
        res.status(500).send('Error: ' + error.message);
    }
});

async function saveTags(tagNames) {
    try {
        for (let i = 0; i < tagNames.length; i++) {
            const tagName = tagNames[i];

            // Check if the tag exists in the database
            const existingTag = await Tags.findOne({ name: tagName });

            if (existingTag) {
                // If the tag exists, increment the counter
                existingTag.count++;
                await existingTag.findOneAndUpdate();
            } else {
                // If the tag does not exist, create a new model and save it to the database
                const newTag = new Tags({ name: tagName });
                await newTag.save();
            }
        }


    } catch (error) {

    }
}

module.exports = router;