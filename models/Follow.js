const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
    followerId: mongoose.Schema.Types.ObjectId,
    followingId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Follow', FollowSchema);