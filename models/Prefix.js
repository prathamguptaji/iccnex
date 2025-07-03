const mongoose = require('mongoose');
const prefix = process.env.prefix

const prefixSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: prefix }
});

module.exports = mongoose.model('Prefix', prefixSchema);
