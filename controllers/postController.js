const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');


// Exporting the createPost function
exports.createPost = async (req, res) => {
  const { userId, content, imageUrl, hashtags, category } = req.body;

  try {
    const newPost = new Post({
      userId,
      content,
      imageUrl,
      hashtags,
      category,
      datetimePosted: new Date(),
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get Feed
exports.getFeed = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const { page: validatedPage, limit: validatedLimit } = validatePagination(page, limit);
    const follows = await Follow.find({ followerId: req.user._id });
    const followingIds = follows.map(f => f.followingId);
    const feed = await Post.find({ publisherId: { $in: followingIds } })
      .sort('-datetimePosted')
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit);

    res.json({ success: true, data: feed });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Search Posts by Hashtags
exports.searchPosts = async (req, res) => {
  const { hashtag, page = 1, limit = 10, category, date } = req.query;
  try {
    const { page: validatedPage, limit: validatedLimit } = validatePagination(page, limit);
    const filters = { hashtags: { $in: [hashtag] } };
    if (category) filters.category = category;
    if (date) filters.datetimePosted = { $gte: new Date(date) };

    const posts = await Post.find(filters)
      .sort('-datetimePosted')
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit);

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get Likes with Pagination
exports.getLikes = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const { page: validatedPage, limit: validatedLimit } = validatePagination(page, limit);
    const likes = await Like.find({ postId })
      .populate('userId', 'username profilePicture')
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit);

    res.json({ success: true, data: likes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get Comments with Pagination
exports.getComments = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const { page: validatedPage, limit: validatedLimit } = validatePagination(page, limit);
    const comments = await Comment.find({ postId })
      .populate('userId', 'username profilePicture')
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit);

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add Like to Post
exports.addLike = async (req, res) => {
  const { postId } = req.params;
  try {
    const alreadyLiked = await Like.findOne({ userId: req.user._id, postId });
    if (alreadyLiked) return res.status(400).json({ success: false, error: 'Post already liked' });

    await Like.create({ userId: req.user._id, postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    res.json({ success: true, message: 'Post liked successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add Comment to Post
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  // Basic input validation for comment
  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Comment cannot be empty' });
  }

  try {
    await Comment.create({ userId: req.user._id, postId, comment });
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Helper function for pagination
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (isNaN(pageNum) || pageNum <= 0) throw new Error('Invalid page number');
  if (isNaN(limitNum) || limitNum <= 0) throw new Error('Invalid limit number');
  return { page: pageNum, limit: limitNum };
};
