const Admin = require('../models/Admin');

module.exports = {
    name: 'setadmin',
    description: 'Set a user as the report admin.',
    async execute(client, message, args) {
        // Only server owner or someone with ADMINISTRATOR can set the admin
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply("You need `ADMINISTRATOR` permission to use this command.");
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            return message.reply("Please mention a valid user or provide their ID.");
        }

        await Admin.findOneAndUpdate(
            { guildId: message.guild.id },
            { adminId: user.id },
            { upsert: true }
        );

        message.channel.send(`✅ ${user.tag} has been set as the report admin.`);
    }
};
