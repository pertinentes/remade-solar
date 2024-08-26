const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Signaler un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à signaler')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du signalement')
                .setRequired(true)),
    
    async execute(interaction) {
        const guild = interaction.client.guilds.cache.get(config.guild);
        if (!guild.members.cache.has(interaction.user.id)) {
            return interaction.reply({
                content: `Pour report/signaler un utilisateur merci de vous rendre sur le serveur de support (https://discord.gg/setgKnNWdz) et de faire cette commande dans le salon <#${config.channels.report}>`,
                ephemeral: true
            });
        }

        const reportedUser = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison');
        const reportId = uuidv4();

        const reportEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Nouveau signalement')
            .addFields(
                { name: 'ID du signalement', value: reportId, inline: true },
                { name: 'Utilisateur signalé', value: reportedUser.toString(), inline: true },
                { name: 'Signalé par', value: interaction.user.toString(), inline: true },
                { name: 'Raison', value: reason }
            )
            .setTimestamp();

        const reportChannel = interaction.client.channels.cache.get(config.channels.report);
        await reportChannel.send({ embeds: [reportEmbed] });

        interaction.client.db.set(`reports.${reportId}`, {
            reportedUserId: reportedUser.id,
            reporterUserId: interaction.user.id,
            reason: reason,
            timestamp: new Date().toISOString()
        });

        await interaction.reply({
            content: `Votre signalement a été envoyé avec succès. ID du signalement: ${reportId}`,
            ephemeral: true
        });
    },
};