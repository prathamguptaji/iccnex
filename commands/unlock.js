module.exports = {
    name: 'unlock',
    description: 'Unlock the current channel',
    async execute(client, message,args) {
        if (!message.guild || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('❌ Admins only.');

        const channel = message.channel;
        const everyoneRole = message.guild.roles.everyone;

        try {
            await channel.updateOverwrite(everyoneRole, { SEND_MESSAGES: true });
            message.channel.send('🔓 Channel unlocked. Use `!lock-revert` to restore original permissions.');
        } catch (err) {
            console.error(err);
            message.channel.send('❌ Failed to unlock the channel.');
        }
    }
};
