const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-invite')
        .setDescription('Obtenir une invitation à un serveur via un ID')
        .addStringOption(option =>
            option.setName('serveur-id')
                .setDescription('L\'ID du serveur pour lequel obtenir une invitation')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

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

        const serverId = interaction.options.getString('serveur-id');

        try {
            const guild = await interaction.client.guilds.fetch(serverId);
            
            if (!guild) {
                return interaction.reply({ content: 'Impossible de trouver le serveur spécifié.', ephemeral: true });
            }

            let invite;
            const invites = await guild.invites.fetch();

            if (invites.size > 0) {
                invite = invites.first();
            } else {
                const channel = guild.channels.cache.find(channel => channel.type === 0 && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite));
                
                if (!channel) {
                    return interaction.reply({ content: 'Impossible de créer une invitation. Aucun salon trouvé.', ephemeral: true });
                }

                invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            }

            await interaction.reply(`Voici l'invitation pour le serveur : ${invite.url}`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur s\'est produite lors du traitement de la commande.', ephemeral: true });
        }
    },
};