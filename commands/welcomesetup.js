const WelcomeConfig = require('../models/WelcomeConfig');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'wfsetup',
  description: 'Configure welcome and farewell messages.',
  aliases: ['wfs'],
  async execute(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.reply('❌ You need `MANAGE_GUILD` permission to use this command.');
    }

    const [action, type, ...rest] = args;
    const config = await WelcomeConfig.findOne({ guildId: message.guild.id }) || new WelcomeConfig({ guildId: message.guild.id });

    if (action === 'welcome-channel') {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('❌ Mention a channel.');
      config.welcomeChannel = channel.id;
    } else if (action === 'farewell-channel') {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('❌ Mention a channel.');
      config.farewellChannel = channel.id;
    } else if (action === 'welcome-message') {
      config.welcomeMessage = rest.join(' ');
    } else if (action === 'farewell-message') {
      config.farewellMessage = rest.join(' ');
    } else if (action === 'welcome-type') {
      if (!['text', 'embed'].includes(type)) return message.reply('❌ Use "text" or "embed".');
      config.welcomeType = type;
    } else if (action === 'farewell-type') {
      if (!['text', 'embed'].includes(type)) return message.reply('❌ Use "text" or "embed".');
      config.farewellType = type;
    } else {
      return message.reply('❌ Invalid setup command. Examples:\n`icc welcomesetup welcome-channel #general`\n`icc welcomesetup welcome-message Welcome {user} to {server}`');
    }

    await config.save();
    message.reply('✅ Setup updated.');
  }
};
