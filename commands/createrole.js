module.exports = {
    name: 'createrole',
    aliases:["cr"],
    description: 'Creates a role with no permissions',
    async execute(client, message, args) {
        const roleName = args.join(' ');
        if (!roleName) {
            return message.channel.send('❌ Please provide a role name.');
        }

        try {
            const role = await message.guild.roles.create({
                data: {
                    name: roleName,
                    permissions: [], // No permissions
                },
                reason: `Role created by ${message.author.tag}`,
            });

            message.channel.send(`✅ Role \`${role.name}\` created with no permissions.`);
        } catch (error) {
            console.error('Role Creation Error:', error);
            message.channel.send('❌ An error occurred while creating the role.');
        }
    }
};
