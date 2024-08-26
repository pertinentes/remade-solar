const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist-liste')
        .setDescription('Affiche la liste des utilisateurs blacklistés'),

    async execute(interaction, client) {
        if (!config.dev.includes(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setTitle('Information')
                .setDescription('**Cette commande est reservé à l\'équipe de SolarBot**')
                .setFooter({ text: 'SolarBot', iconURL: 'https://cdn.discordapp.com/avatars/1245063415831990324/135de19d6ef46b0d6e874a974769b08d.webp' })
                .setTimestamp()
                .setColor('#000000');
            
            return interaction.reply({ embeds: [embed] });
        }


        const utilisateursBlacklistes = await client.db.get('blacklistedUsers') || [];

        if (utilisateursBlacklistes.length === 0) {
            return await interaction.reply({ content: "Aucun utilisateur n'est blacklisté pour le moment.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Liste des utilisateurs blacklistés')
            .setColor(0x000000)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        for (const user of utilisateursBlacklistes) {
            const userInfo = await client.users.fetch(user.id).catch(() => null);
            const username = userInfo ? userInfo.tag : 'Utilisateur inconnu';
            const timestamp = Math.floor(new Date(user.date).getTime() / 1000);

            embed.addFields({
                name: `Utilisateur: ${username}`,
                value: `> **ID**: \`${user.id}\`\n> **Raison**: \`${user.raison}\`\n> **Date**: <t:${timestamp}:F>`,
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
