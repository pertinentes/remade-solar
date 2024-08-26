const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hype')
        .setDescription('Envoyer un message de hype')
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer le message de hype')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mention')
                .setDescription('Le type de mention à utiliser')
                .setRequired(true)
                .addChoices(
                    { name: 'here', value: 'here' },
                    { name: 'everyone', value: 'everyone' }
                )),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('salon');
        const mentionType = interaction.options.getString('mention');

        if (!interaction.member.permissions.has(PermissionFlagsBits.MentionEveryone)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser les mentions @here ou @everyone.", ephemeral: true });
        }

        const hypeEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Hype')
            .setDescription(`**<@${interaction.user.id}> a lancé un message de hype !**`)
            .setFooter({ text: 'SolarBot' })
            .setTimestamp();

        const mentionText = mentionType === 'here' ? '@here' : '@everyone';

        await channel.send({ content: mentionText, embeds: [hypeEmbed] })
            .then(message => {
                message.react('🎉');
            });

        await interaction.reply({ content: "**Votre message a bien été envoyé avec SolarBot !**", ephemeral: true });
    },
};
