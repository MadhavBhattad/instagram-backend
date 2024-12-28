const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// Register
exports.register = async (req, res) => {
  const { username, email, password, bio, profilePicture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      bio,
      profilePicture,
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret');
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  const { username, page = 1, limit = 10 } = req.query;
  try {
    const { page: validatedPage, limit: validatedLimit } = validatePagination(page, limit);
    const users = await User.find({ username: { $regex: username, $options: 'i' } })
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// View Profile
exports.viewProfile = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const { username, email, bio, profilePicture } = user;
    const posts = await Post.find({ publisherId: userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      profile: {
        username,
        email,
        bio,
        profilePicture,
      },
      posts,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Follow User
exports.followUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if the user is already following
    const alreadyFollowing = await Follow.findOne({
      followerId: req.user._id,
      followingId: userId,
    });
    if (alreadyFollowing) {
      return res.status(400).json({ success: false, error: 'Already following this user' });
    }

    // Create a new follow relationship
    await Follow.create({ followerId: req.user._id, followingId: userId });

    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function for pagination validation
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (isNaN(pageNum) || pageNum <= 0) throw new Error('Invalid page number');
  if (isNaN(limitNum) || limitNum <= 0) throw new Error('Invalid limit number');
  return { page: pageNum, limit: limitNum };
};
