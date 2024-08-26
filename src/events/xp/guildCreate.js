const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        const guildId = guild.id;
        const filePath = path.join(__dirname, '..', '..', 'level', `${guildId}.json`);
        
        const initialData = {
            users: {}
        };

        await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
    },
};
