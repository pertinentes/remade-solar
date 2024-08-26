const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Envoyer une suggestion')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Votre suggestion')
                .setRequired(true)),

    async execute(interaction, client) {
        const suggestionEnabled = client.db.get(`suggestionEnabled_${interaction.guild.id}`) || false;
        const suggestionChannelId = client.db.get(`suggestionChannel_${interaction.guild.id}`);

        if (!suggestionEnabled) {
            return await interaction.reply({ content: "Le système de suggestion n'est pas activé sur ce serveur.", ephemeral: true });
        }

        const suggestionChannel = interaction.guild.channels.cache.get(suggestionChannelId);
        if (!suggestionChannel) {
            return await interaction.reply({ content: "Le salon de suggestions n'a pas été trouvé. Veuillez contacter un administrateur.", ephemeral: true });
        }

        const suggestion = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setTitle(`Nouvelle suggestion de ${interaction.user.username}`)
            .setDescription(`\`\`\`${suggestion}\`\`\`\n**ID :** \`${interaction.user.id}\``)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setColor('#000000')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

        try {
            await interaction.deferReply({ ephemeral: true });

            const suggestionMessage = await suggestionChannel.send({ embeds: [embed] });
            await suggestionMessage.react('👍');
            await suggestionMessage.react('🤷');
            await suggestionMessage.react('👎');

            await interaction.editReply({ content: "Votre suggestion a été envoyée avec succès !", ephemeral: true });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la suggestion:', error);
            await interaction.editReply({ content: "Une erreur est survenue lors de l'envoi de votre suggestion. Veuillez réessayer plus tard.", ephemeral: true });
        }
    },
};
