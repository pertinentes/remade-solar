const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute un membre')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du unmute')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'unmute des membres.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');
        const reason = interaction.options.getString('raison') || 'Pas de raison fournie';

        if (!member) {
            return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
        }

        if (!member.isCommunicationDisabled()) {
            return await interaction.reply({
                embeds: [{
                    title: 'Unmute',
                    description: "Ce membre n'est pas mute !",
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

        try {
            await member.timeout(null, reason);

            const embed = {
                color: 0x000000,
                title: 'Unmute',
                description: `\`${member.user.tag}\` **vient d'être unmute !**\n\n**Raison :** \`${reason}\`\n\n**Modérateur :** <@${interaction.user.id}>`,
                footer: {
                    text: 'SolarBot',
                    icon_url: interaction.client.user.displayAvatarURL(),
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur est survenue lors de l'unmute.", ephemeral: true });
        }
    },
};