const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bienvenue')
        .setDescription('Système de bienvenue')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('état')
                .setDescription('Etat du système de bienvenue (activer/désactiver)')
                .setRequired(true)
                .addChoices(
                    { name: 'Activer', value: 'activer' },
                    { name: 'Désactiver', value: 'désactiver' }
                ))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Salon où seront envoyés les messages de bienvenue')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer le système de suggestion.", ephemeral: true });
        }
        const etat = interaction.options.getString('état');
        const salon = interaction.options.getChannel('salon');
        let welcomeEnabled = client.db.get(`welcomeEnabled_${interaction.guild.id}`) || false;
        const welcomeChannel = client.db.get(`welcomeChannel_${interaction.guild.id}`);

        const embed = new EmbedBuilder()
            .setTitle('Bienvenue')
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000');

        if (etat === 'activer') {
            if (welcomeEnabled) {
                embed.setDescription('**Le système de bienvenue est déjà activé sur le serveur !**');
            } else {
                if (!salon) {
                    embed.setTitle('Information')
                        .setDescription('**Indiquez un salon où seront envoyés les messages de bienvenue**');
                } else {
                    welcomeEnabled = true;
                    client.db.set(`welcomeEnabled_${interaction.guild.id}`, true);
                    client.db.set(`welcomeChannel_${interaction.guild.id}`, salon.id);
                    embed.setDescription(`**<@${interaction.user.id}> vient d'activer le système de bienvenue dans <#${salon.id}>**`);
                }
            }
        } else if (etat === 'désactiver') {
            if (!welcomeEnabled) {
                embed.setDescription("**Le système de bienvenue n'est pas activé sur le serveur !**");
            } else {
                welcomeEnabled = false;
                client.db.set(`welcomeEnabled_${interaction.guild.id}`, false);
                client.db.delete(`welcomeChannel_${interaction.guild.id}`);
                embed.setDescription('**Le système de bienvenue a été désactivé !**');
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
