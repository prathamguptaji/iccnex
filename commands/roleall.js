const Discord = require('discord.js');

module.exports = {
  name: 'role-all',
  description: 'Adds a role to all members in the server.',
  usage: '!role-all @RoleName or !role-all RoleID',

  async execute(client, message, args) {
    if (!message.guild) return message.channel.send('❌ This command can only be used in a server.');

    if (!message.member.hasPermission('MANAGE_ROLES'))
      return message.channel.send('❌ You do not have permission to manage roles.');

    if (!message.guild.me.hasPermission('MANAGE_ROLES'))
      return message.channel.send('❌ I do not have permission to manage roles.');

    // Try to get role from mention or ID
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.channel.send('❌ Please mention a valid role or provide its ID.');

    if (role.position >= message.guild.me.roles.highest.position)
      return message.channel.send('❌ That role is higher or equal to my highest role, I cannot assign it.');

    const members = message.guild.members.cache.filter(member => !member.roles.cache.has(role.id));

    if (members.size === 0) return message.channel.send('✅ Everyone already has this role.');

    message.channel.send(`🔄 Adding **${role.name}** to ${members.size} members. This may take a while...`);

    let success = 0;
    let failed = 0;

    for (const member of members.values()) {
      try {
        await member.roles.add(role);
        success++;
      } catch (err) {
        failed++;
      }
    }

    message.channel.send(`✅ Done! Role added to ${success} members.\n❌ Failed to add for ${failed} members.`);
  }
};
