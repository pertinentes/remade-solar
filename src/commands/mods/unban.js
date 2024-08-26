const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban une personne')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription("L'utilisateur à unban")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du débannissement')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de débannir des membres.", ephemeral: true });
        }

        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Pas de raison fournie.';

        if (!user) {
            return await interaction.reply({ content: 'Utilisateur non trouvé.', ephemeral: true });
        }

        try {
            await interaction.guild.members.unban(user, reason);

            const embed = {
                color: 0x000000,
                title: 'Unban',
                description: `\`${user.tag}\` **vient d'être débanni !**\n\n**Raison :** \`${reason}\`\n\n **Modérateur :** <@${interaction.user.id}>`,
                footer: {
                    text: 'SolarBot',
                    icon_url: interaction.client.user.displayAvatarURL(),
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors du débannissement.', ephemeral: true });
        }
    },
};
