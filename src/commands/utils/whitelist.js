const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Ajouter un utilisateur à la whitelist')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à ajouter à la whitelist')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'ajout à la whitelist')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const utilisateurCible = interaction.options.getUser('utilisateur');
        const raison = interaction.options.getString('raison');

        const whitelistedUsers = await client.db.get(`whitelist.${interaction.guild.id}`) || [];

        if (whitelistedUsers.some(user => user.id === utilisateurCible.id)) {
            return interaction.reply({ content: `${utilisateurCible.tag} est déjà sur la whitelist de ce serveur.`, ephemeral: true });
        }

        const entreeWhitelist = {
            id: utilisateurCible.id,
            raison: raison,
            date: new Date().toISOString()
        };

        whitelistedUsers.push(entreeWhitelist);
        await client.db.set(`whitelist.${interaction.guild.id}`, whitelistedUsers);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Whitelist')
            .setDescription(`\`${utilisateurCible.tag}\` **a été ajouté à la whitelist !**\n\n**Raison :** \`${raison}\`\n\n **Modérateur :** <@${interaction.user.id}>`)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
