const fs = require('fs');
const triggerdb = './triggers.json';


module.exports = {
    name: 'trigger-add',
    description: 'Add a new trigger and its reply',
    execute(client, message, args) {
        if (args.length < 2) return message.reply('Usage: `trigger-add <trigger> <response>`');

        const trigger = args[0].toLowerCase();
        const response = args.slice(1).join(' ');

        let triggers = {};
        if (fs.existsSync(triggerdb)) {
            triggers = JSON.parse(fs.readFileSync(triggerdb));
        }

        triggers[trigger] = response;

        fs.writeFileSync(triggerdb, JSON.stringify(triggers, null, 2));

        message.reply(`Trigger \`${trigger}\` added successfully!`);
    }
};
