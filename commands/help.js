const Discord = require('discord.js');
const Prefix = require('../models/Prefix'); // Import the model directly

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands',

    async execute(client, message, args) {
        try {
            // Fetch prefix from MongoDB
            let data = await Prefix.findOne({ guildId: message.guild.id });
            let prefix = data?.prefix || 'icc'; // fallback to default if not found

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Available Commands')
                .setDescription('Here are the commands you can use:')
                .addFields(
                    { name: `${prefix}ping`, value: 'Check the bot\'s latency.' },
                    { name: `${prefix}createrole <role_name>`, value: 'Create a new role with no permissions.' },
                    { name: `${prefix}autojoinrole @Role`, value: 'Set an auto role to assign when someone joins.' },
                    { name: `${prefix}help`, value: 'Display this help message.' }
                )
                .setFooter(`Use ${prefix}command_name for more details on a specific command.`);

            message.channel.send(embed);
        } catch (err) {
            console.error(err);
            message.channel.send('⚠️ An error occurred while fetching the help menu.');
        }
    }
}
