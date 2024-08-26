const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('systeme-suggestion')
        .setDescription('Activer/Désactiver le système de suggestion sur le serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Activer/Désactiver le système de suggestion')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                ))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Dans quel salon envoyer les suggestions')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer le système de suggestion.", ephemeral: true });
        }

        const etat = interaction.options.getString('état');
        const salon = interaction.options.getChannel('salon');
        let suggestionEnabled = client.db.get(`suggestionEnabled_${interaction.guild.id}`) || false;
        const suggestionChannel = client.db.get(`suggestionChannel_${interaction.guild.id}`);

        const embed = new EmbedBuilder()
            .setTitle('Système-Suggestion')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (suggestionEnabled) {
                embed.setDescription('**Le système de suggestion est déjà activé sur le serveur !**');
            } else {
                if (!salon) {
                    embed.setTitle('Information')
                        .setDescription('**Indiquez un salon où seront envoyées les suggestions**');
                } else {
                    suggestionEnabled = true;
                    client.db.set(`suggestionEnabled_${interaction.guild.id}`, true);
                    client.db.set(`suggestionChannel_${interaction.guild.id}`, salon.id);
                    embed.setDescription(`**<@${interaction.user.id}> vient d'activer le \`système de suggestion\` sur le serveur !**`);
                }
            }
        } else if (etat === 'désactiver') {
            if (!suggestionEnabled) {
                embed.setDescription("**Le système de suggestion n'est pas activé sur le serveur !**");
            } else {
                suggestionEnabled = false;
                client.db.set(`suggestionEnabled_${interaction.guild.id}`, false);
                client.db.delete(`suggestionChannel_${interaction.guild.id}`);
                embed.setDescription('**Le système de suggestion a été désactivé !**');
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
