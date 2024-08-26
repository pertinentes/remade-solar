const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anti-bot')
        .setDescription('Pour activer ou désactiver l\'anti-bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat de l\'anti-bot (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                )),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer l'anti-bot.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        let antibotEnabled = client.db.get(`antibot.${interaction.guild.id}`) || false;

        const embed = new EmbedBuilder()
            .setTitle('Anti-bot')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (antibotEnabled) {
                embed.setDescription("**L'anti-bot est déjà activé sur le serveur !**");
            } else {
                antibotEnabled = true;
                client.db.set(`antibot.${interaction.guild.id}`, true);
                embed.setDescription(`**<@${interaction.user.id}> vient d'activer \`l'anti-bot\` sur le serveur !**`);
            }
        } else if (etat === 'désactiver') {
            if (!antibotEnabled) {
                embed.setDescription("**L'anti-bot n'est pas activé sur le serveur !**");
            } else {
                antibotEnabled = false;
                client.db.set(`antibot.${interaction.guild.id}`, false);
                embed.setDescription("**L'anti-bot a été désactivé !**");
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
