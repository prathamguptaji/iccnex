module.exports = {
    name: 'kick',
    aliases: ["tmkc"],
    description: 'Kick a user from the server.',
    async execute(client, message, args) {
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return message.reply('❌ You need **Kick Members** permission.');
        }

        const member = message.mentions.members.first();
        if (!member) return message.reply('❌ Please mention a user to kick.');

        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        try {
            await member.kick(reason);
            message.reply(`✅ Successfully kicked **${member.user.tag}**.`);
        } catch (error) {
            console.error('Kick Error:', error);
            message.reply('❌ Failed to kick the user.');
        }
    }
};
