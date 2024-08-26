const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-link')
        .setDescription('Pour activer ou désactiver l\'anti-link')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-link (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-link.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antilinkEnabled = client.db.get(`antilink.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-link')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antilinkEnabled) {
                embed.setDescription("**L'anti-link est déjà activé sur le serveur !**");
            } else {
                antilinkEnabled = true;
                client.db.set(`antilink.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-link\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antilinkEnabled) {
                embed.setDescription("**L'anti-link n'est pas activé sur le serveur !**");
            } else {
                antilinkEnabled = false;
                client.db.set(`antilink.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-link a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
