const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reponse-candidature')
        .setDescription('Répondre à une candidature')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('L\'ID de l\'utilisateur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reponse')
                .setDescription('La réponse à la candidature')
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


        const userId = interaction.options.getString('userid');
        const response = interaction.options.getString('reponse');

        try {
            const user = await interaction.client.users.fetch(userId);

            const responseEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Réponse à votre candidature')
                .addFields(
                    { name: 'Candidat', value: user.toString(), inline: true },
                    { name: 'Réponse du staff', value: response }
                )
                .setTimestamp();

            await user.send({ embeds: [responseEmbed] });

            const confirmationEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Réponse envoyée')
                .addFields(
                    { name: 'Réponse envoyée à', value: user.toString() }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [confirmationEmbed] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message privé:', error);
            await interaction.reply({
                content: 'Impossible d\'envoyer la réponse en message privé. L\'utilisateur a peut-être désactivé les messages privés ou l\'ID est invalide.',
                ephemeral: true
            });
        }
    },
};
