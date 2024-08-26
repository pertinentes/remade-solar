const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Voir les informations d\'un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur pour qui vous souhaitez voir les informations')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        const member = await interaction.guild.members.fetch(user.id);

        const createdTimestamp = Math.floor(user.createdTimestamp / 1000);
        const isBlacklisted = await client.db.get(`blacklist.${user.id}`);

        const userInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Information sur l\'utilisateur')
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
            .addFields(
                {
                    name: 'Information utilisateur',
                    value: `> **Pseudo :** \`${user.username}\`
> **ID :** \`${user.id}\`
> **Avatar :** [URL](${user.displayAvatarURL({ dynamic: true })})
> **Badges :** \`Indisponible pour le moment\`
> **Bot :** ${user.bot ? '✅' : '❌'}
> **Date d'inscription :** <t:${createdTimestamp}:F>
> **Blacklist :** ${isBlacklisted ? '✅' : '❌'}`,
                    inline: false
                }
            )
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [userInfoEmbed] });
    },
};
