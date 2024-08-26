const { InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require("discord.js");
const { Client, Interaction } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const utilisateursBlacklistes = await client.db.get('blacklistedUsers') || [];
        const estBlackliste = utilisateursBlacklistes.some(user => user.id === interaction.user.id);

        if (estBlackliste && interaction.isChatInputCommand()) {
            return interaction.reply({ content: "Vous êtes sur la blacklist et ne pouvez pas utiliser les commandes du bot.", ephemeral: true });
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'create_ticket') {
                const ticketCategory = client.db.get(`ticketCategory_${interaction.guild.id}`);
                if (!ticketCategory) {
                    return interaction.reply({ content: "La catégorie de ticket n'a pas été configurée.", ephemeral: true });
                }

                const ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: ticketCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });

                const ticketEmbed = new EmbedBuilder()
                    .setTitle('🎫 Ticket 🎫')
                    .setDescription(`**<@${interaction.user.id}> Voici votre ticket un staff arrive ! **`)
                    .setFooter({ text: 'SolarBot', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL());

                const ticketButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close')
                            .setLabel('Fermer le ticket')
                            .setEmoji('🗑')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('reclamer')
                            .setLabel('Réclamer')
                            .setEmoji('🔓')
                            .setStyle(ButtonStyle.Success)
                    );

                await ticketChannel.send({ embeds: [ticketEmbed], components: [ticketButtons] });
                await interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
            } else if (interaction.customId === 'close') {
                const channel = interaction.channel;

                const closeEmbed = new EmbedBuilder()
                    .setTitle('🔒 Fermeture du ticket')
                    .setDescription('Êtes-vous sûr de vouloir fermer ce ticket ?')
                    .setColor('#ff0000')
                    .setTimestamp();

                const confirmButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm-close')
                            .setLabel('Confirmer')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('cancel-close')
                            .setLabel('Annuler')
                            .setStyle(ButtonStyle.Secondary)
                    );

                await interaction.reply({ embeds: [closeEmbed], components: [confirmButtons], ephemeral: true });

                const collector = channel.createMessageComponentCollector({ time: 15000 });

                collector.on('collect', async i => {
                    if (i.customId === 'confirm-close') {
                        await channel.delete();
                    } else if (i.customId === 'cancel-close') {
                        await i.update({ content: 'Fermeture du ticket annulée.', embeds: [], components: [], ephemeral: true });
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.editReply({ content: 'Temps écoulé. Fermeture du ticket annulée.', embeds: [], components: [], ephemeral: true });
                    }
                });
            } else if (interaction.customId === 'reclamer') {
                const ticketCreator = interaction.channel.name.split('-')[1];
                if (interaction.user.username === ticketCreator) {
                    await interaction.reply({ content: "Vous ne pouvez pas réclamer votre propre ticket.", ephemeral: true });
                } else {
                    await interaction.reply({ content: `Le ticket a été réclamé par ${interaction.user}.`, ephemeral: false });
                }
            }
        } else if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ content: "Commande non reconnue.", ephemeral: true });
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "Une erreur est survenue lors de l'exécution de cette commande.", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Une erreur est survenue lors de l'exécution de cette commande.", ephemeral: true });
                }
            }
        }
    }
}