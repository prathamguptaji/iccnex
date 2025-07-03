const ChannelLock = require('../models/ChannelLock');

module.exports = {
    name: 'lock',
    description: 'Lock the current channel and save original permissions',
    async execute(client,message,args) {
        if (!message.guild || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('❌ Admins only.');

        const channel = message.channel;
        const everyoneRole = message.guild.roles.everyone;
        const currentOverwrite = channel.permissionOverwrites.get(everyoneRole.id);

        const allowBitfield = currentOverwrite ? currentOverwrite.allow.bitfield : null;

        // Save to DB
        await ChannelLock.findOneAndUpdate(
            { channelId: channel.id },
            { allowBitfield },
            { upsert: true }
        );

        try {
            await channel.updateOverwrite(everyoneRole, { SEND_MESSAGES: false });
            message.channel.send('🔒 Channel locked. Use `!unlock` or `!lock-revert` when needed.');
        } catch (err) {
            console.error(err);
            message.channel.send('❌ Failed to lock the channel.');
        }
    }
};
