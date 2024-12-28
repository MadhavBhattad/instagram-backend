const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  bio: String,
  profilePicture: String,           // Considering profile picture is on google (url).
  createdAt: { type: Date, default: Date.now },
  googleId: String,
});

module.exports = mongoose.model('User', UserSchema);
