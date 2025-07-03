const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

module.exports = {
    name: 'links',
    description: 'Sends important links with buttons',
    async execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("🔗 ICCNEX | Important Links")
            .setDescription("Click the buttons below to access our panel, website, or store.")
            .setColor("#00b0f4")
            .setFooter("ICCNEX Host");

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Panel")
                .setStyle("url")
                .setEmoji("🙃")
                .setURL("https://paid.iccnex.in"),

            new MessageButton()
                .setLabel("Website")
                .setStyle("url")
                .setEmoji("🌐")
                .setURL("https://iccnex.in"),

            new MessageButton()
                .setLabel("Store")
                .setStyle("url")
                .setEmoji("🏪")
                .setURL("https://store.iccnex.in"),

            new MessageButton()
                .setLabel("Trustpilot")
                .setStyle("url")
                .setEmoji("👍")
                .setURL("https://www.trustpilot.com/review/iccnex.in"),
            );

        message.channel.send({ embed: embed, components: [row] });
    }
};
