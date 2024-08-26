const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const levelDir = path.join(__dirname, '..', '..', 'level');

        for (const guild of client.guilds.cache.values()) {
            const guildId = guild.id;
            const filePath = path.join(levelDir, `${guildId}.json`);

            try {
                await fs.access(filePath);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    const initialData = { users: {} };
                    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
                } else {
                }
            }
        }
    },
};
