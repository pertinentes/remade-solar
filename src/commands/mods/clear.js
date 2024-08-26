const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer un certain nombre de messages d\'un salon')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Nombre de messages à supprimer')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Salon dans lequel supprimer les messages')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission de gérer les messages.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('nombre');
        const channel = interaction.options.getChannel('salon') || interaction.channel;

        if (!channel.isTextBased()) {
            return interaction.reply({ content: 'Vous ne pouvez supprimer des messages que dans un salon textuel.', ephemeral: true });
        }

        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Je n\'ai pas la permission de gérer les messages dans ce salon.', ephemeral: true });
        }

        try {
            const messages = await channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setTitle('🗑️ Clear 🗑️')
                .setDescription(`Les **${messages.size}** messages ont bien été supprimés !`)
                .setFooter({ text: `SolarBot • ${new Date().toLocaleString()}`, iconURL: client.user.displayAvatarURL() })
                .setColor('#0099ff');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la suppression des messages.', ephemeral: true });
        }
    },
};