const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-channel')
        .setDescription('Pour activer ou désactiver l\'anti-channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-channel (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-channel.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antichannelEnabled = client.db.get(`antichannel.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-channel')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antichannelEnabled) {
                embed.setDescription("**L'anti-channel est déjà activé sur le serveur !**");
            } else {
                antichannelEnabled = true;
                client.db.set(`antichannel.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-channel\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antichannelEnabled) {
                embed.setDescription("**L'anti-channel n'est pas activé sur le serveur !**");
            } else {
                antichannelEnabled = false;
                client.db.set(`antichannel.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-channel a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
