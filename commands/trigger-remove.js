const fs = require('fs');
const triggerdb = './triggers.json';


module.exports = {
    name: 'trigger-remove',
    description: 'Remove an existing trigger',
    execute(client, message, args) {
        if (!args[0]) return message.reply('Usage: `trigger-remove <trigger>`');

        const trigger = args[0].toLowerCase();

        if (!fs.existsSync(path)) return message.reply('No triggers exist yet.');

        let triggers = JSON.parse(fs.readFileSync(path));

        if (!triggers[trigger]) return message.reply(`Trigger \`${trigger}\` does not exist.`);

        delete triggers[trigger];

        fs.writeFileSync(path, JSON.stringify(triggers, null, 2));

        message.reply(`Trigger \`${trigger}\` removed successfully!`);
    }
};
