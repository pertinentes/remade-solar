const { SlashCommandBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à blacklist')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du blacklist')
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


        const utilisateurCible = interaction.options.getUser('utilisateur');
        const raison = interaction.options.getString('raison');

        const utilisateursBlacklistes = await client.db.get('blacklistedUsers') || [];

        if (utilisateursBlacklistes.some(user => user.id === utilisateurCible.id)) {
            return interaction.reply({ content: `${utilisateurCible.tag} est déjà sur la blacklist.`});
        }

        const entreeBlacklist = {
            id: utilisateurCible.id,
            raison: raison,
            date: new Date().toISOString()
        };

        utilisateursBlacklistes.push(entreeBlacklist);
        await client.db.set('blacklistedUsers', utilisateursBlacklistes);

        interaction.reply({ content: `${utilisateurCible.tag} a été blacklist. \nRaison : ${raison}`});
    },
};