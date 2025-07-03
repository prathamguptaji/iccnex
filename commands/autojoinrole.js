const AutoJoinRole = require('../models/AutoJoinRole');

module.exports = {
  name: 'autojoinrole',
  description: 'Set an auto role to assign when someone joins.',
  usage: '!autojoinrole @Role',
  async execute(client, message, args) {
    if (!message.member.hasPermission('MANAGE_ROLES'))
      return message.channel.send('❌ You don’t have permission to set auto roles.');

    const role = message.mentions.roles.first();
    if (!role) return message.channel.send('❌ Please mention a valid role.');

    if (role.position >= message.guild.me.roles.highest.position)
      return message.channel.send('❌ I cannot assign that role. It’s higher than my highest role.');

    try {
      await AutoJoinRole.findOneAndUpdate(
        { guildId: message.guild.id },
        { roleId: role.id },
        { upsert: true, new: true }
      );

      message.channel.send(`✅ Auto-join role has been set to **${role.name}**.`);
    } catch (err) {
      console.error('AutoJoinRole DB Error:', err);
      message.channel.send('❌ Failed to set auto-join role. Please try again.');
    }
  }
};
