module.exports = async (client) => {
    // Log when the bot is ready
    console.log(`${client.user.tag} has successfully logged in!`);
    console.log("Bot is now online and ready to serve!");

    // Set bot's status and activity
    try {
        // Set the bot's status to 'online' with a custom activity message
        await client.user.setStatus('dnd'); // 'online', 'idle', 'dnd', 'invisible'
        await client.user.setActivity('Serving the community!', {
            type: 'STREAMING', // 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'
            url: 'https://www.iccnex.com', // Optional URL for streaming
        });

        console.log(`Bot activity set to: Watching "Serving the community!"`);

    } catch (error) {
        console.error('Error setting activity status:', error);
    }

    // Optional: Log bot guild and member count
    const guildCount = client.guilds.cache.size;
    const userCount = client.users.cache.size;
    console.log(`Bot is in ${guildCount} servers with ${userCount} users.`);

    // Log additional useful information (optional)
    console.log(`Bot's prefix is: ${process.env.PREFIX}`);
};
