const mongoose = require('mongoose');
module.exports = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  tech: [String],
  liveUrl: String,
  repoUrl: String,
  createdAt: { type: Date, default: Date.now }
}));
