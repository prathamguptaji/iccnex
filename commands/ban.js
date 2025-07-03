module.exports = {
    name: 'ban',
    aliases: ["fuck"],
    description: 'Ban a user from the server.',
    async execute(client, message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.reply('❌ You need **Ban Members** permission.');
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Please mention a user to ban.');

        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await member.ban({ reason });
            message.reply(`✅ Successfully banned **${member.user.tag}**.`);
        } catch (error) {
            console.error('Ban Error:', error);
            message.reply('❌ Failed to ban the user.');
        }
    }
};
