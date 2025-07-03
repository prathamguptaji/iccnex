const Report = require('../models/Report');
const Admin = require('../models/Admin');

module.exports = {
    name: 'report',
    description: 'Report a user. Only allowed by the report admin.',
    async execute(client, message, args) {
        const admin = await Admin.findOne({ guildId: message.guild.id });
        if (!admin || message.author.id !== admin.adminId)
            return message.reply("❌ You are not authorized to use this command.");

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) return message.reply("❌ Please mention a valid user.");

        if (user.id === message.author.id)
            return message.reply("❌ You cannot report yourself.");

        const reason = args.slice(1).join(" ").slice(0, 100) || "Not found";

        let report = await Report.findOne({ userId: user.id, guildId: message.guild.id });
        if (!report) {
            report = new Report({
                userId: user.id,
                guildId: message.guild.id,
                reports: 1,
                lastReportedAt: new Date(),
                lastReason: reason
            });
        } else {
            report.reports += 1;
            report.lastReportedAt = new Date();
            report.lastReason = reason;
        }

        await report.save();

        message.channel.send(`📢 Reported **${user.tag}** (Total: ${report.reports})\n📝 Reason: *${reason}*`);
    }
};
