const Discord = require('discord.js');

module.exports = {
    name: 'servericon',
    aliases:['sicon'],
    description: 'Display the server\'s icon.',
    async execute(client, message, args) {
        const serverIcon = message.guild.iconURL({ dynamic: true, size: 4096 });
        if (!serverIcon) return message.reply('This server does not have an icon.');

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name}'s Icon`)
            .setImage(serverIcon)
            .setColor('#5865F2') // Discord blurple
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send(embed);
    }
};
