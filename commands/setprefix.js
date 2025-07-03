const Prefix = require('../models/Prefix');

module.exports = {
    name: 'setprefix',
    aliases: ["sp"],
    description: 'Change the server prefix.',
    async execute(client, message, args) {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.reply('❌ You need **Manage Server** permission.');
        }

        const newPrefix = args[0];
        if (!newPrefix) {
            return message.reply('❌ Please provide a new prefix.');
        }

        try {
            await Prefix.findOneAndUpdate(
                { guildId: message.guild.id },
                { prefix: newPrefix },
                { upsert: true, new: true }
            );

            message.reply(`✅ Prefix updated to \`${newPrefix}\`!`);
        } catch (error) {
            console.error('Prefix Update Error:', error);
            message.reply('❌ Failed to update prefix.');
        }
    }
};
