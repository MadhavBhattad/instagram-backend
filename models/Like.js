const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Like', LikeSchema);