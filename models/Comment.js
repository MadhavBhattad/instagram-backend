const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
    comment: String,
    datetimeCommented: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);