
const Prefix = require('../models/Prefix');
const fs = require('fs');
const { triggerdb } = require('../config.js');



module.exports = async (client, message) => {
    if (message.author.bot) return;

    // Fetch prefix from database
    const data = await Prefix.findOne({ guildId: message.guild.id });
    const customPrefix = data ? data.prefix : process.env.PREFIX;
    const defaultPrefix = 'icc'; // Always allow 'icc'
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    // Choose the prefix used in the message
    const prefixes = [defaultPrefix, customPrefix];
    if (!fs.existsSync(triggerdb)) return;

    const triggers = JSON.parse(fs.readFileSync(triggerdb));
    const content = message.content.toLowerCase();

    // Check for exact whole word match using regex
    for (const trigger in triggers) {
        const regex = new RegExp(`\\b${escapeRegex(trigger)}\\b`, 'i'); // case-insensitive
        if (regex.test(content)) {
            return message.channel.send(triggers[trigger]);
        }
    }


    // Find which prefix the message starts with (if any)
    const usedPrefix = prefixes.find(p => message.content.startsWith(p));
    if (!usedPrefix) {
        // If bot is mentioned directly without using a prefix
        if (message.mentions.has(client.user)) {
            return;
        }
        return;
    }

    // Command handler
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Find command by name or aliases
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error('Command Execution Error:', error);
        message.reply('❌ There was an error trying to execute that command.');
    }
};



