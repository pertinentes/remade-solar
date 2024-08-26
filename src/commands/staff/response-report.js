const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('response-report')
        .setDescription('Répondre à un signalement')
        .addStringOption(option =>
            option.setName('report_id')
                .setDescription('L\'ID du signalement')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reponse')
                .setDescription('La réponse au signalement')
                .setRequired(true)),

    async execute(interaction) {
        if (!config.dev.includes(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setTitle('Information')
                .setDescription('**Cette commande est reservé à l\'équipe de SolarBot**')
                .setFooter({ text: 'SolarBot', iconURL: 'https://cdn.discordapp.com/avatars/1245063415831990324/135de19d6ef46b0d6e874a974769b08d.webp' })
                .setTimestamp()
                .setColor('#000000');
            
            return interaction.reply({ embeds: [embed] });
        }


        const reportId = interaction.options.getString('report_id');
        const response = interaction.options.getString('reponse');

        const reportData = await interaction.client.db.get(`reports.${reportId}`);

        if (!reportData) {
            return interaction.reply({
                content: 'Aucun report trouvé avec cet ID.',
                ephemeral: true
            });
        }

        const reportedUser = await interaction.client.users.fetch(reportData.reportedUserId);
        const reporterUser = await interaction.client.users.fetch(reportData.reporterUserId);

        const responseEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Réponse à votre report')
            .addFields(
                { name: 'ID du report', value: reportId, inline: true },
                { name: 'Utilisateur signalé', value: reportedUser.toString(), inline: true },
                { name: 'Réponse du staff', value: response }
            )
            .setTimestamp();

        try {
            await reporterUser.send({ embeds: [responseEmbed] });

            const confirmationEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Réponse envoyée')
                .addFields(
                    { name: 'ID du signalement', value: reportId },
                    { name: 'Réponse envoyée à', value: reporterUser.toString() }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [confirmationEmbed] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message privé:', error);
            await interaction.reply({
                content: 'Impossible d\'envoyer la réponse en message privé. L\'utilisateur a peut-être désactivé les messages privés.',
                ephemeral: true
            });
        }
    },
};
