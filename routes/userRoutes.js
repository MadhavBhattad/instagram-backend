const express = require('express');
const {
  register,
  login,
  searchUsers,
  viewProfile,
  followUser,
} = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Search Users
router.get('/search', searchUsers);

// View Profile
router.get('/profile/:userId', viewProfile);

// Follow User
router.post('/follow/:userId', authenticate, followUser);

module.exports = router;
