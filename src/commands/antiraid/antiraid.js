const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-raid')
        .setDescription('Pour activer ou désactiver l\'anti-raid')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-raid (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-raid.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antiraidEnabled = client.db.get(`antiraid.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-raid')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antiraidEnabled) {
                embed.setDescription("**L'anti-raid est déjà activé sur le serveur !**");
            } else {
                antiraidEnabled = true;
                client.db.set(`antiraid.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-raid\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antiraidEnabled) {
                embed.setDescription("**L'anti-raid n'est pas activé sur le serveur !**");
            } else {
                antiraidEnabled = false;
                client.db.set(`antiraid.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-raid a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
