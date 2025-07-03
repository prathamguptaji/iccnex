const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    aliases:['si'],
    description: 'Display information about the server.',
    async execute(client, message, args) {
        const { guild } = message;

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('#FFD700')
            .addField('Server Name', guild.name, true)
            .addField('Server ID', guild.id, true)
            .addField('Owner', `<@${guild.ownerID}>`, true)
            .addField('Members', guild.memberCount.toLocaleString(), true)
            .addField('Region', guild.region, true)
            .addField('Created On', guild.createdAt.toDateString(), true)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send(embed);
    }
};
