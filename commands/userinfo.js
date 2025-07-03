const Discord = require('discord.js');

module.exports = {
    name: 'userinfo',
    aliases:['ui'],
    description: 'Display information about a user.',
    async execute(client, message, args) {
        const member = message.mentions.members.first() || message.member;
        const user = member.user;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor('#90EE90')
            .addField('Username', user.tag, true)
            .addField('ID', user.id, true)
            .addField('Bot', user.bot ? 'Yes' : 'No', true)
            .addField('Created On', user.createdAt.toDateString(), true)
            .addField('Joined Server', member.joinedAt ? member.joinedAt.toDateString() : 'Unknown', true)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send(embed);
    }
};
