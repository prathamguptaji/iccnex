const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({
  guildID: String,
  channelID: String
});

module.exports = mongoose.model("VoiceChannel", voiceSchema);
