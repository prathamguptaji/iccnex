const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases:['av'],
    description: 'Display the avatar of a user.',
    async execute(client, message, args) {
        const user = message.mentions.users.first() || message.author;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor('#00FFFF')
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.channel.send(embed);
    }
};
