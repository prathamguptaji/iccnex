const AutoJoinRole = require('../models/AutoJoinRole');

module.exports = async (client, member) => {
  try {
    const data = await AutoJoinRole.findOne({ guildId: member.guild.id });
    if (!data) return;

    const role = member.guild.roles.cache.get(data.roleId);
    if (!role) return;

    await member.roles.add(role);
    console.log(`✅ Gave ${role.name} to ${member.user.tag}`);
  } catch (err) {
    console.error('AutoJoinRole Error:', err);
  }
};
