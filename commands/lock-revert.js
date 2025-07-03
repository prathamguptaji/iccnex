const ChannelLock = require('../models/ChannelLock');

module.exports = {
    name: 'lock-revert',
    description: 'Revert the channel to its original permissions',
    async execute(client,message,args) {
        if (!message.guild || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('❌ Admins only.');

        const channel = message.channel;
        const everyoneRole = message.guild.roles.everyone;

        const data = await ChannelLock.findOne({ channelId: channel.id });
        if (!data) return message.reply('❌ No saved permission data found.');

        try {
            await channel.updateOverwrite(everyoneRole, {
                SEND_MESSAGES: data.allowBitfield === null ? null : Boolean(data.allowBitfield & 0x800)
            });

            await ChannelLock.deleteOne({ channelId: channel.id }); // Optional: clean up
            message.channel.send('✅ Channel permissions reverted.');
        } catch (err) {
            console.error(err);
            message.channel.send('❌ Failed to revert permissions.');
        }
    }
};
