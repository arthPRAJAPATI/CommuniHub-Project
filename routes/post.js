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
router.get('/createPost', async function (req, res) {
    const communityList = await Community.find();
    console.log(communityList);
    res.render('createPost', { communityList });
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
            user: '6536b5ed943e0a906a1240b2',
            tags: req.body.tags.split(',').map(tag => tag.trim()).map(tag => `#${tag}`),
            community: req.body.community
        });

        console.log(newPost);
        // Save the post to the database
        await newPost.save();

        // Redirect to a success page or perform other actions as needed
        res.redirect('/dashboard');
    } catch (error) {
        // Handle errors (e.g., validation errors or database connection issues)
        res.status(500).send('Error: ' + error.message);
    }
});


module.exports = router;