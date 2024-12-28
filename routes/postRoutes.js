const express = require('express');
const {
  createPost,
  getFeed,
  searchPosts,
  getLikes,         
  getComments,      
  addLike,          
  addComment,       
} = require('../controllers/postController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// To create a new post
router.post('/', authenticate, createPost);

// To get user feed
router.get('/feed', authenticate, getFeed);

// Search posts by hashtag, category, date, etc.
router.get('/search', searchPosts);

// Get likes for a specific post with pagination
router.get('/:postId/likes', getLikes);

// Get comments for a specific post with pagination
router.get('/:postId/comments', getComments);

// Like a specific post
router.post('/:postId/like', authenticate, addLike);

// Add a comment to a post
router.post('/:postId/comment', authenticate, addComment);

module.exports = router;
