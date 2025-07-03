const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channel',
    description: 'Advanced channel management.',
    aliases: ['c'],
    async execute(client, message, args) {
        // Check for permissions
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.channel.send(new MessageEmbed()
                .setColor('#FF0000')
                .setAuthor('Permission Denied')
                .setDescription('❌ You need `Manage Channels` permission to use this command.')
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true })));
        }

        const sub = args[0]?.toLowerCase();

        if (!sub) {
            return message.channel.send(new MessageEmbed()
                .setColor('#FFA500')
                .setTitle('Channel Command Usage')
                .setDescription('Available subcommands:\n\n`create <name>` – Create a new text channel\n`delete #channel` – Delete a channel\n`nuke #channel` – Recreate a channel\n`clone #channel [new-name]` – Clone a channel\n\nExample: `icc channel nuke #general`')
                .setFooter('Channel Manager'));
        }

        // ===== SUBCOMMAND: CREATE =====
        if (sub === 'create') {
            const name = args.slice(1).join('-');
            if (!name) {
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Please provide a name for the new channel.'));
            }

            try {
                const newChannel = await message.guild.channels.create(name, { type: 'text' });
                return message.channel.send(new MessageEmbed()
                    .setColor('#00FF00')
                    .setDescription(`✅ Channel <#${newChannel.id}> created successfully.`));
            } catch (err) {
                console.error(err);
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to create the channel.'));
            }
        }

        // ===== SUBCOMMAND: DELETE =====
        if (sub === 'delete') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Please mention a channel to delete.'));
            }

            try {
                await channel.delete();
                return message.channel.send(new MessageEmbed()
                    .setColor('#00FF00')
                    .setDescription(`✅ Channel **${channel.name}** has been deleted.`));
            } catch (err) {
                console.error(err);
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to delete the channel.'));
            }
        }

        // ===== SUBCOMMAND: NUKE =====
        if (sub === 'nuke') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Please mention a channel to nuke.'));
            }

            const name = channel.name;
            const type = channel.type;
            const parentID = channel.parentID;
            const perms = channel.permissionOverwrites.array();
            const pos = channel.position;

            try {
                await channel.delete();

                setTimeout(async () => {
                    const newChannel = await message.guild.channels.create(name, {
                        type,
                        parent: parentID,
                        permissionOverwrites: perms,
                        position: pos
                    });

                    await newChannel.send(`💥 Channel nuked by ${message.author}`);
                    return message.channel.send(new MessageEmbed()
                        .setColor('#00FF00')
                        .setDescription(`✅ Channel **${name}** nuked successfully.`));
                }, 2000);
            } catch (err) {
                console.error(err);
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to nuke the channel.'));
            }
        }

        // ===== SUBCOMMAND: CLONE =====
        if (sub === 'clone') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Please mention a channel to clone.'));
            }

            const newName = args.slice(2).join('-') || `${channel.name}-clone`;

            try {
                const newChannel = await channel.clone({ name: newName });
                await newChannel.setParent(channel.parentID);
                await newChannel.setPosition(channel.position + 1);

                return message.channel.send(new MessageEmbed()
                    .setColor('#00FF00')
                    .setDescription(`✅ Cloned channel as <#${newChannel.id}>.`));
            } catch (err) {
                console.error(err);
                return message.channel.send(new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to clone the channel.'));
            }
        }

        // ===== UNKNOWN SUBCOMMAND =====
        return message.channel.send(new MessageEmbed()
            .setColor('#FF0000')
            .setDescription('❌ Unknown subcommand. Use `create`, `delete`, `nuke`, or `clone`.'));
    }
};
