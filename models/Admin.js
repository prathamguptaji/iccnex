const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    adminId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);
