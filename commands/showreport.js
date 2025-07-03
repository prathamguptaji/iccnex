const Report = require('../models/Report');

module.exports = {
    name: 'showreport',
    description: 'Check report count and last reason for a user.',
    async execute(client, message, args) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) return message.reply("❌ Please mention a valid user.");

        const report = await Report.findOne({ userId: user.id, guildId: message.guild.id });
        if (!report) {
            return message.channel.send(`✅ **${user.tag}** has no reports.`);
        }

        const embed = new (require('discord.js')).MessageEmbed()
            .setTitle(`📋 Reports for ${user.tag}`)
            .addField("Total Reports", report.reports.toString(), true)
            .addField("Last Reason", report.lastReason || "Not found", true)
            .addField("Last Reported At", report.lastReportedAt.toLocaleString(), false)
            .setColor("#ff5555")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));

        message.channel.send(embed);
    }
};
