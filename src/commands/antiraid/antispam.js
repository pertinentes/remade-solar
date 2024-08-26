const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-spam')
        .setDescription('Pour activer ou désactiver l\'anti-spam')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-spam (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-spam.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antispamEnabled = client.db.get(`antispam.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-spam')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antispamEnabled) {
                embed.setDescription("**L'anti-spam est déjà activé sur le serveur !**");
            } else {
                antispamEnabled = true;
                client.db.set(`antispam.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-spam\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antispamEnabled) {
                embed.setDescription("**L'anti-spam n'est pas activé sur le serveur !**");
            } else {
                antispamEnabled = false;
                client.db.set(`antispam.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-spam a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
