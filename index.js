require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');
const VoiceChannel = require("./models/voice.js");
const ReactionRole = require("./models/ReactionRole");

const app = express();
const PORT = process.env.PORT || 3000;
const UPDATE_CHANNEL_ID = process.env.UPDATE_CHANNEL_ID;


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB!');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});


// Staff Schema
const staffSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
});
const Staff = mongoose.model('Staff', staffSchema);

// Express Website
app.use(express.urlencoded({ extended: true }));



app.listen(PORT, () => {
    console.log(`🌐 Website running on http://localhost:${PORT}`);
});

// Discord Bot
const client = new Discord.Client();
require('discord-buttons')(client);
client.commands = new Discord.Collection();

// Load Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
}


// Ready Event
client.once('ready',async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    const voiceDocs = await VoiceChannel.find();
  voiceDocs.forEach(async doc => {
    const guild = client.guilds.cache.get(doc.guildID);
    if (!guild) return;
    const channel = guild.channels.cache.get(doc.channelID);
    if (channel && channel.type === "voice") {
      try {
        await channel.join();
        console.log(`Rejoined VC in guild: ${guild.name}`);
      } catch (err) {
        console.log(`Failed to join saved VC in ${guild.name}:`, err.message);
      }
    }
  });
    
});
client.on('message', async (message) => {
  // Ignore bots and DMs
  if (message.author.bot || !message.guild) return;

  // Optionally whitelist admins
  if (message.member.hasPermission('ADMINISTRATOR')) return;

  // Regex to detect common links
  const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|discord\.gg\/\S+|discord\.com\/invite\/\S+|[a-zA-Z0-9.-]+\.(com|net|org|xyz|in|co|site|me|gg|link|app|info))/gi;

  if (linkRegex.test(message.content)) {
    try {
      await message.delete();
      message.channel.send(
        `${message.author}, links are not allowed in this server.`
      ).then(msg => msg.delete({ timeout: 5000 }));
    } catch (err) {
      console.error('Failed to delete message or send warning:', err);
    }
  }
});



// Error Handling
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful Shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        console.log('🛑 Shutting down...');
        await client.destroy();
        await mongoose.connection.close();
        process.exit(0);
    });
});
client.on('guildMemberAdd', member => {
    require('./events/joinrole')(client, member);
  });
  

// Start Bot
client.login(process.env.TOKEN).catch(err => {
    console.error('❌ Login failed:', err);
    process.exit(1);
});

const { triggerdb } = require('./config.js');

module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;

    if (!fs.existsSync(triggerdb)) return;

    const triggers = JSON.parse(fs.readFileSync(triggerdb));
    const content = message.content.toLowerCase();

    for (const trigger in triggers) {
        if (content.includes(trigger)) {
            return message.channel.send(triggers[trigger]);
        }
    }
};
