const Discord = require('discord.js');

module.exports = {
    name: 'purge',
    aliases:['clear'],
    description: 'Deletes a specified number of messages from the channel.',
    usage: 'iccpurge <amount>',
    async execute(client, message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to purge messages.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please provide a valid number of messages to delete.');
        }

        if (amount > 500) {
            return message.reply('You can only delete up to 500 messages at once to avoid rate limits.');
        }

        const deletedAuthors = new Map(); // Map of userId => username
        let deletedCount = 0;
        let remaining = amount;

        async function deleteBatch() {
            const fetchAmount = remaining > 100 ? 100 : remaining;
            const messages = await message.channel.messages.fetch({ limit: fetchAmount });

            if (!messages.size) {
                return finish();
            }

            messages.forEach(msg => {
                deletedAuthors.set(msg.author.id, msg.author.username);
            });

            await message.channel.bulkDelete(messages, true).catch(err => console.error('Bulk delete error:', err));
            deletedCount += messages.size;
            remaining -= messages.size;

            if (remaining > 0) {
                setTimeout(deleteBatch, 1500); // 1.5 seconds delay to avoid hitting rate limits
            } else {
                finish();
            }
        }

        function finish() {
            const uniqueAuthors = [...deletedAuthors.values()];
            const embed = new Discord.MessageEmbed()
                .setTitle('🧹 Purge Complete')
                .setColor('ORANGE')
                .setDescription(`Deleted **${deletedCount}** messages.`)
                .addField('Authors', uniqueAuthors.length > 0 ? uniqueAuthors.join(', ') : 'No authors found.')
                .setTimestamp();

            message.channel.send({ embed });
        }

        deleteBatch();
    }
};
