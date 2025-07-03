const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reports: { type: Number, default: 0 },
    lastReportedAt: { type: Date, default: Date.now },
    lastReason: { type: String, default: "Not found" }
});

module.exports = mongoose.model('Report', reportSchema);
