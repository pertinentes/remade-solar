
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sanctions')
        .setDescription('Définir la sanction pour les anti-raid')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type de sanction à appliquer')
                .setRequired(true)
                .addChoices(
                    { name: 'Kick', value: 'kick' },
                    { name: 'Ban', value: 'ban' },
                    { name: 'Retirer les permissions', value: 'removePerms' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer les sanctions anti-raid.", ephemeral: true });
        }

        const sanctionType = interaction.options.getString('type');
        const guildId = interaction.guild.id;

        await client.db.set(`sanction.${guildId}`, sanctionType);

        const embed = new EmbedBuilder()
            .setTitle('Sanctions Anti-raid')
            .setDescription(`La sanction pour les événements anti-raid a été définie sur : **${sanctionType}**`)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        await interaction.reply({ embeds: [embed] });
    },
};
