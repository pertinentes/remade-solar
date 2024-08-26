const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Unwarn un membre')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option =>
            option.setName('warn-id')
                .setDescription('L\'ID du warn à supprimer')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'unwarn des membres.", ephemeral: true });
        }

        const warnId = interaction.options.getString('warn-id');
        const guildId = interaction.guild.id;

        let warnRemoved = false;
        let warnInfo = null;

        for (const userId in client.db.get(`warn.${guildId}`)) {
            const userWarns = client.db.get(`warn.${guildId}.${userId}`);
            const warnIndex = userWarns.findIndex(warn => warn.id === warnId);
            
            if (warnIndex !== -1) {
                warnInfo = userWarns[warnIndex];
                userWarns.splice(warnIndex, 1);
                client.db.set(`warn.${guildId}.${userId}`, userWarns);
                warnRemoved = true;
                break;
            }
        }

        if (!warnRemoved) {
            const embed = new EmbedBuilder()
                .setTitle('Unwarn')
                .setDescription('Aucun warn trouvé avec cet ID.')
                .setColor(0x000000)
                .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
            return await interaction.reply({ embeds: [embed] });
        }

        const warnedUser = await interaction.client.users.fetch(warnInfo.moderator);
        const warnedMember = await interaction.guild.members.fetch(warnInfo.moderator);

        const embed = new EmbedBuilder()
            .setTitle('Unwarn')
            .setColor(0x000000)
            .setThumbnail(warnedUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Information', value: `> **Enlever par :** <@${interaction.user.id}>\n> **ID** : \`${warnId}\`\n> **Warn de** : <@${warnInfo.moderator}>`, inline: false },
                { name: 'Warn Information', value: `> **ID** : \`${warnId}\`\n> **Warn de** : <@${warnInfo.moderator}>\n> **Auteur :** <@${warnInfo.moderator}>\n> **Raison** : \`${warnInfo.reason}\`\n> **Date** : <t:${Math.floor(new Date(warnInfo.timestamp).getTime() / 1000)}:F>`, inline: false }
            )
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
