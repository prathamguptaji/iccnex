const VoiceChannel = require("../models/voice.js");

module.exports = {
  name: "joinvc",
  description: "Make the bot join your VC and remember it",
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send("You must be in a voice channel.");
    }

    const channel = message.member.voice.channel;

    try {
      await channel.join();
      await VoiceChannel.findOneAndUpdate(
        { guildID: message.guild.id },
        { channelID: channel.id },
        { upsert: true }
      );

      message.channel.send(`Joined and saved voice channel: ${channel.name}`);
    } catch (err) {
      console.error(err);
      message.channel.send("Failed to join the voice channel.");
    }
  }
};
