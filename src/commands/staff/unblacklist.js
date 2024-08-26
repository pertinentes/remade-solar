const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Retirer un utilisateur de la blacklist pour lui permettre d\'utiliser les commandes du bot')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à retirer de la blacklist')
                .setRequired(true)),

    async execute(interaction, client) {
        if (!config.dev.includes(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setTitle('Information')
                .setDescription('**Cette commande est reservé à l\'équipe de SolarBot**')
                .setFooter({ text: 'SolarBot', iconURL: 'https://cdn.discordapp.com/avatars/1245063415831990324/135de19d6ef46b0d6e874a974769b08d.webp' })
                .setTimestamp()
                .setColor('#000000');
            
            return interaction.reply({ embeds: [embed] });
        }


        const target = interaction.options.getUser('utilisateur');

        const userBlacklist = await client.db.get('blacklistedUsers') || [];

        const index = userBlacklist.findIndex(user => user.id === target.id);

        if (index === -1) {
            return interaction.reply({ content: `${target.username} n'est pas sur la blacklist.`, ephemeral: true });
        }

        userBlacklist.splice(index, 1);
        await client.db.set('blacklistedUsers', userBlacklist);

        interaction.reply({ content: `${target.username} a été retiré de la blacklist.`, ephemeral: true });
    },
};
