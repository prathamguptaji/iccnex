const mongoose = require('mongoose');

module.exports = mongoose.model('WelcomeConfig', new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  welcomeChannel: String,
  farewellChannel: String,
  welcomeType: { type: String, default: 'text' }, // 'text' or 'embed'
  farewellType: { type: String, default: 'text' },
  welcomeMessage: String,
  farewellMessage: String
}));
