const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Donne le classement du serveur en fonction de l\'xp'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const filePath = path.join(__dirname, '..', '..', 'level', `${guildId}.json`);

        try {
            const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
            const sortedUsers = Object.entries(data.users)
                .sort(([, a], [, b]) => b.xp - a.xp)
                .slice(0, 10);

            const embed = new EmbedBuilder()
                .setTitle('Classement du serveur')
                .setDescription('Voici le classement des utilisateurs en fonction de leur XP')
                .setColor('#3498db');

            for (const [index, [userId, userInfo]] of sortedUsers.entries()) {
                const user = await interaction.client.users.fetch(userId);
                embed.addFields({
                    name: `${index + 1}. ${user.username}`,
                    value: `Niveau: ${userInfo.level}, XP: ${userInfo.xp}`,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier de niveau:', error);
            await interaction.reply('Une erreur est survenue lors de la récupération du classement.');
        }
    },
};
