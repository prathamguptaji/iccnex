const Prefix = require('../models/Prefix');

module.exports = {
    name: 'prefix',
    aliases: ["p"],
    description: 'Set or show the server prefix.',

    async execute(client, message, args) {
 
                const data = await Prefix.findOne({ guildId: message.guild.id });
                const currentPrefix = data?.prefix || '!';
                return message.reply(`📌 The current prefix is \`${currentPrefix}\`.`);
            }


  
};
