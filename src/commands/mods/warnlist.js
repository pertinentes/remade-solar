const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('Affiche les warns d\'un membre')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Les warns du membre que vous voulez voir')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');

        if (!member) {
            return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const userId = member.id;

        const warns = client.db.get(`warn.${guildId}.${userId}`) || [];

        if (warns.length === 0) {
            return await interaction.reply({ content: "Ce membre n'a pas de warn !" });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warns de ${member.user.tag}`)
            .setColor(0x000000)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        warns.forEach((warn, index) => {
            const moderator = interaction.guild.members.cache.get(warn.moderator);
            const moderatorName = moderator ? moderator.user.tag : 'Modérateur inconnu';
            const timestamp = Math.floor(new Date(warn.timestamp).getTime() / 1000);

            embed.addFields({
                name: `Warn n°${index + 1}`,
                value: `> **Auteur** : ${moderatorName}\n> **ID** : \`${warn.id}\`\n> **Raison** : \`${warn.reason}\`\n> **Date** : <t:${timestamp}:F>`,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed] });
    },
};
