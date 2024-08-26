const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwhitelist')
        .setDescription('Retirer un utilisateur de la whitelist')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à retirer de la whitelist')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const utilisateurCible = interaction.options.getUser('utilisateur');

        const whitelistedUsers = await client.db.get(`whitelist.${interaction.guild.id}`) || [];

        const userIndex = whitelistedUsers.findIndex(user => user.id === utilisateurCible.id);

        if (userIndex === -1) {
            return interaction.reply({ content: `${utilisateurCible.tag} n'est pas whitelist sur ce serveur.`, ephemeral: true });
        }

        whitelistedUsers.splice(userIndex, 1);
        await client.db.set(`whitelist.${interaction.guild.id}`, whitelistedUsers);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Unwhitelist')
            .setDescription(`\`${utilisateurCible.tag}\` **a été retiré de la whitelist !**\n\n **Modérateur :** <@${interaction.user.id}>`)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
