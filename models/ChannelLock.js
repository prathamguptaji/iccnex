const mongoose = require('mongoose');

const channelLockSchema = new mongoose.Schema({
    channelId: { type: String, required: true, unique: true },
    allowBitfield: { type: Number }, // Can be null if there was no overwrite
});

module.exports = mongoose.model('ChannelLock', channelLockSchema);
