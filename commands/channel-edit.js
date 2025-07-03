const Discord = require('discord.js');

module.exports = {
    name: 'channel-edit',
    aliases: ['editc', 'cedit'],
    description: 'Rename a channel or move it to another category without changing permissions.',
    async execute(client, message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.reply('❌ You need **Manage Channels** permission to use this command.');
        }

        const channel = message.mentions.channels.first() || message.channel; // Edit current channel if no mention

        if (!channel) {
            return message.reply('❌ Please mention a valid channel or use this command inside the channel you want to edit.');
        }

        const subCommand = args.shift()?.toLowerCase();

        if (!subCommand || (subCommand !== 'name' && subCommand !== 'category')) {
            return message.reply('❌ Please specify what you want to edit: `name` or `category`.\nExample: `!channel-edit name new-name` or `!channel-edit category category-id`');
        }

        if (subCommand === 'name') {
            const newName = args.join(' ');
            if (!newName) {
                return message.reply('❌ Please provide a new name.');
            }

            try {
                await channel.setName(newName);
                message.reply(`✅ Channel renamed to **${newName}** successfully!`);
            } catch (error) {
                console.error('Rename Error:', error);
                message.reply('❌ Failed to rename the channel.');
            }
        }

        if (subCommand === 'category') {
            const categoryId = args[0];
            if (!categoryId) {
                return message.reply('❌ Please provide the **category ID** to move the channel to.');
            }

            const category = message.guild.channels.cache.get(categoryId);

            if (!category || category.type !== 'category') {
                return message.reply('❌ Invalid category ID.');
            }

            try {
                await channel.setParent(categoryId, { lockPermissions: false }); // <-- Important change
                message.reply(`✅ Channel moved to category **${category.name}** without changing permissions!`);
            } catch (error) {
                console.error('Move Category Error:', error);
                message.reply('❌ Failed to move the channel.');
            }
        }
    }
};
