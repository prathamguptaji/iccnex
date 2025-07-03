const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(client, message, args) {
        const latency = Date.now() - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const embed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('🏓 Pong!')
            .addField('Latency', `\`${latency}ms\``, true)
            .addField('API Latency', `\`${apiLatency}ms\``, true)
            .setTimestamp();

        message.channel.send(embed);
    }
};
