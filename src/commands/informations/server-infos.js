
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Voir les informations du serveur'),
    async execute(interaction, client) {
        const guild = interaction.guild;
        const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);
        const owner = await guild.fetchOwner();

        const antiBot = await client.db.get(`antiraid.${guild.id}.antibot`) ? '✅' : '❌';
        const antiInsulte = await client.db.get(`antiraid.${guild.id}.antiinsulte`) ? '✅' : '❌';
        const antiLink = await client.db.get(`antiraid.${guild.id}.antilink`) ? '✅' : '❌';
        const antiRaid = await client.db.get(`antiraid.${guild.id}.antiraid`) ? '✅' : '❌';
        const antiSpam = await client.db.get(`antiraid.${guild.id}.antispam`) ? '✅' : '❌';

        const welcome = await client.db.get(`welcome.${guild.id}`) ? '✅' : '❌';
        const ticket = await client.db.get(`ticket.${guild.id}`) ? '✅' : '❌';
        const suggestion = await client.db.get(`suggestion.${guild.id}`) ? '✅' : '❌';

        const serverInfoEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Information sur ${guild.name}`)
            .addFields(
                {
                    name: 'Information général',
                    value: `> **Nom du serveur :** \`${guild.name}\`
> **Owner (propriétaire) :** <@${owner.id}>
> **ID :** \`${guild.id}\`
> **Boost :** \`${guild.premiumSubscriptionCount} boost(s) | Niveau ${guild.premiumTier}\`
> **Membres :** \`${guild.memberCount}\`
> **Salons :** \`${guild.channels.cache.size}\`
> **Rôles :** \`${guild.roles.cache.size}\`
> **Emoji :** \`${guild.emojis.cache.size}\`
> **Création :** <t:${createdTimestamp}:F>`,
                    inline: false
                },
                {
                    name: 'Sécurité',
                    value: `> **Anti-bot :** ${antiBot}
> **Anti-insulte :** ${antiInsulte}
> **Anti-link :** ${antiLink}
> **Anti-raid :** ${antiRaid}
> **Anti-spam :** ${antiSpam}`,
                    inline: false
                },
                {
                    name: 'Fonctionnalité',
                    value: `> **Bienvenue :** ${welcome}
> **Ticket :** ${ticket}
> **Suggestion :** ${suggestion}`,
                    inline: false
                }
            )
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [serverInfoEmbed] });
    },
};
