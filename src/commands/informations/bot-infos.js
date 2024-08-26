const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Voir les informations du bot'),
    async execute(interaction, client) {
        const botUser = client.user;

        const botInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot-info')
            .setDescription(`**Pseudo :** \`${botUser.username}\`
**ID :** \`${botUser.id}\`
**Statut :** \`${client.presence.status}\`
**Date de création :** <t:${Math.floor(botUser.createdTimestamp / 1000)}:F>
**Créateur :** \`L*!S (@xshadow2.0)\`
**Serveurs :** \`${client.guilds.cache.size}\`
**Utilisateurs :** \`${client.users.cache.size}\`
**E-mail :** \`solarbotfr@gmail.com\``)
            .setThumbnail(botUser.displayAvatarURL({ dynamic: true, size: 128 }))
            .setFooter({ text: 'SolarBot', iconURL: botUser.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/AQQbhuGute')
                    .setEmoji('1241508004206088193'),
                new ButtonBuilder()
                    .setLabel('Ajouter SolarBot')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${botUser.id}&permissions=8&scope=bot%20applications.commands`)
                    .setEmoji('1224005084514615436'),
                new ButtonBuilder()
                    .setLabel('Site web')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://solarbot.webnode.fr/')
                    .setEmoji('1224005087165419630')
                    .setDisabled(true)
            );

        await interaction.reply({ embeds: [botInfoEmbed], components: [row] });
    },
};
