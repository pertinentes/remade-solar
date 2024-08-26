const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute un membre')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('temps')
                .setDescription('Le temps du mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du mute')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de mute des membres.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');
        const duration = interaction.options.getString('temps');
        const reason = interaction.options.getString('raison') || 'Pas de raison fournie';

        if (!member) {
            return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return await interaction.reply({
                embeds: [{
                    title: 'Information',
                    description: 'Tu ne peux pas te mute toi même',
                    footer: {
                        text: 'SolarBot',
                        icon_url: interaction.client.user.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    color: 0x000000,
                }],
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return await interaction.reply({
                embeds: [{
                    title: 'Information',
                    description: 'Je ne peux pas mute cette personne',
                    footer: {
                        text: 'SolarBot',
                        icon_url: interaction.client.user.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    color: 0x000000,
                }],
                ephemeral: true
            });
        }

        const durationMs = ms(duration);
        if (!durationMs) {
            return await interaction.reply({ content: 'Durée invalide. Utilisez un format valide (ex: 1d, 1h, 30m).', ephemeral: true });
        }

        try {
            await member.timeout(durationMs, reason);

            const embed = {
                color: 0x000000,
                title: 'Mute',
                description: `\`${member.user.tag}\` **vient d'être mute !**\n\n**Raison :** \`${reason}\`\n\n**Temps:** \`${duration}\` \n\n**Modérateur :** <@${interaction.user.id}>`,
                footer: {
                    text: 'SolarBot',
                    icon_url: interaction.client.user.displayAvatarURL(),
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors du mute.', ephemeral: true });
        }
    },
};
