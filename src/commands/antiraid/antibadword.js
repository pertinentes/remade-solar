const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-insulte')
        .setDescription('Pour activer ou désactiver l\'anti-insulte')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-insulte (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-insulte.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antiInsulteEnabled = client.db.get(`antiinsulte.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-insulte')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antiInsulteEnabled) {
                embed.setDescription("**L'anti-insulte est déjà activé sur le serveur !**");
            } else {
                antiInsulteEnabled = true;
                client.db.set(`antiinsulte.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-insulte\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antiInsulteEnabled) {
                embed.setDescription("**L'anti-insulte n'est pas activé sur le serveur !**");
            } else {
                antiInsulteEnabled = false;
                client.db.set(`antiinsulte.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-insulte a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
