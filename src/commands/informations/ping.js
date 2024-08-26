const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérifie la latence du bot'),

    async execute(interaction, client) {
        const startTime = Date.now();
        await interaction.deferReply();
        const endTime = Date.now();

        const botLatency = endTime - startTime;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const embed = {
            title: "🏓 Pong !",
            color: 0x7289DA,
            fields: [
                {
                    name: "Latence de l'api :",
                    value: `${client.ws.ping}ms`,
                    inline: false
                },
                {
                    name: "Latence du bot :",
                    value: `${botLatency}ms`,
                    inline: false
                },
                {
                    name: "En ligne depuis :",
                    value: `${days}j ${hours}h ${minutes}m ${seconds}s`,
                    inline: false
                }
            ],
            footer: {
                text: `Exécuté par ${interaction.user.globalName || interaction.user.username}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true })
            },
            timestamp: new Date()
        };

        await interaction.editReply({ embeds: [embed] });
    },
};
