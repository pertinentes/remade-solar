const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir une personne')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du bannissement')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de bannir des membres.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');
        const reason = interaction.options.getString('raison') || 'Pas de raison fournie';

        if (!member) {
            return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
        }

        if (!member.bannable) {
            return await interaction.reply({ content: 'Ce membre ne peut pas être banni', ephemeral: true });
        }

        try {
            await member.ban({ reason: reason });

            const embed = {
                color: 0x000000,
                title: 'Ban',
                description: `\`${member.user.tag}\` **vient d'être banni !**\n\n**Raison :** \`${reason}\`\n\n **Modérateur :** <@${interaction.user.id}>`,
                footer: {
                    text: 'SolarBot',
                    icon_url: interaction.client.user.displayAvatarURL(),
                },
                timestamp: new Date(),
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors du bannissement.', ephemeral: true });
        }
    },
};
