const Report = require('../models/Report');
const Admin = require('../models/Admin');

module.exports = {
    name: 'clearreport',
    description: 'Clear or set number of reports for a user, with optional reason (admin only).',
    async execute(client, message, args) {
        const admin = await Admin.findOne({ guildId: message.guild.id });
        if (!admin || message.author.id !== admin.adminId) {
            return message.reply("❌ You are not authorized to clear reports.");
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) return message.reply("❌ Please mention a valid user.");

        const numberArg = parseInt(args[1]);
        let newCount = 0;

        if (!isNaN(numberArg) && numberArg >= 0) {
            newCount = numberArg;
        }

        const reason = args.slice(isNaN(numberArg) ? 1 : 2).join(" ").slice(0, 100) || "No reason provided.";

        let report = await Report.findOne({ userId: user.id, guildId: message.guild.id });
        if (!report && newCount === 0) {
            return message.reply("⚠️ This user has no reports to clear.");
        }

        if (!report) {
            report = new Report({ userId: user.id, guildId: message.guild.id, reports: newCount });
        } else {
            report.reports = newCount;
        }

        if (newCount === 0) {
            await Report.deleteOne({ userId: user.id, guildId: message.guild.id });
        } else {
            await report.save();
        }

        return message.channel.send(`✅ Reports for **${user.tag}** set to \`${newCount}\`. Reason: _${reason}_`);
    }
};
