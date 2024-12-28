const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: String,
    postUrl: String,
    hashtags: [String],
    musicUrl: String,
    category: String,
    datetimePosted: { type: Date, default: Date.now },
    publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);