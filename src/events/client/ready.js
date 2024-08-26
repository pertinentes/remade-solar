const { Client, ActivityType } = require("discord.js");
const { versions } = require("../../../versions.json");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`${client.user.tag} est en ligne!`);

        const activities = [
            { name: '/help', type: ActivityType.Watching },
            { name: `${client.guilds.cache.size} serveurs`, type: ActivityType.Watching },
            { name: `${client.users.cache.size} utilisateurs`, type: ActivityType.Watching },
            { name: 'discord.gg/x6UbwQpK3w', type: ActivityType.Watching },
            { name: `La version ${versions}`, type: ActivityType.Watching }
        ];

        let i = 0;
        setInterval(() => {
            if (i >= activities.length) i = 0;
            client.user.setActivity(activities[i]);
            i++;
        }, 7000);
    },
};