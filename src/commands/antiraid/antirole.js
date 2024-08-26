const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-role')
        .setDescription('Pour activer ou désactiver l\'anti-role')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-role (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-role.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antiroleEnabled = client.db.get(`antirole.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-role')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antiroleEnabled) {
                embed.setDescription("**L'anti-role est déjà activé sur le serveur !**");
            } else {
                antiroleEnabled = true;
                client.db.set(`antirole.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-role\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antiroleEnabled) {
                embed.setDescription("**L'anti-role n'est pas activé sur le serveur !**");
            } else {
                antiroleEnabled = false;
                client.db.set(`antirole.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-role a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
