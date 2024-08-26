  const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
  const { Client, Interaction } = require("discord.js")

  module.exports = {
      data: new SlashCommandBuilder()
          .setName('ticket')
          .setDescription('Système de ticket')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     * @returns 
     */

      async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer les tickets.", ephemeral: true });
        }
          let ticketEnabled = client.db.get(`ticketEnabled_${interaction.guild.id}`) || false;
          const ticketChannel = client.db.get(`ticketChannel_${interaction.guild.id}`);
          const ticketCategory = client.db.get(`ticketCategory_${interaction.guild.id}`);
          
          const embed = new EmbedBuilder()
              .setTitle('Configuration du système de ticket')
              .setDescription(`Bienvenue dans la configuration du système de ticket.\n\nLe système de ticket permet aux membres du serveur de faire une demande de support/aide (ticket) pour toutes questions/problèmes grâce à un pannel.\n\nPour \`activer\` ou \`désactiver\` le système de ticket, interagissez avec le premier bouton ci-dessous.\n\n${ticketEnabled ? '🟢' : '🔴'} \`Système ${ticketEnabled ? 'activé' : 'désactivé/Non défini'}\``)
              .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
              .setTimestamp()
              .setColor(ticketEnabled ? '#228B22' : '#880808');

          if (ticketChannel) embed.addFields({ name: 'Salon de ticket', value: `<#${ticketChannel}>` });
          if (ticketCategory) embed.addFields({ name: 'Catégorie de ticket', value: `<#${ticketCategory}>` });

          const row = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('config_ticket')
                      .setLabel(ticketEnabled ? 'Désactiver' : 'Activer')
                      .setStyle(ticketEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
                  new ButtonBuilder()
                      .setCustomId('config_channel')
                      .setLabel('Choisir le salon')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(!ticketEnabled),
                  new ButtonBuilder()
                      .setCustomId('config_category')
                      .setLabel('Choisir la catégorie')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(!ticketEnabled),
                  new ButtonBuilder()
                      .setCustomId('send_ticket')
                      .setLabel('Envoyer l\'embed de ticket')
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(!ticketEnabled || !ticketChannel)
              );

          const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
          const createCollector = () => {
          const collector = response.createMessageComponentCollector({ time: 300000 });

          collector.on('collect', async i => {
              if (i.user.id !== interaction.user.id) {
                  return i.reply({ content: 'Vous ne pouvez pas utiliser ces boutons.', ephemeral: true });
              }

              if (i.customId === 'config_ticket') {
                  ticketEnabled = !ticketEnabled;
                  client.db.set(`ticketEnabled_${interaction.guild.id}`, ticketEnabled);
                  embed.setDescription(`Bienvenue dans la configuration du système de ticket.\n\nLe système de ticket permet aux membres du serveur de faire une demande de support/aide (ticket) pour toutes questions/problèmes grâce à un pannel.\n\nPour \`activer\` ou \`désactiver\` le système de ticket, interagissez avec le premier bouton ci-dessous.\n\n${ticketEnabled ? '🟢' : '🔴'} \`Système ${ticketEnabled ? 'activé' : 'désactivé/Non défini'}\``);
                  embed.setColor(ticketEnabled ? '#228B22' : '#880808');
                  row.components[0].setLabel(ticketEnabled ? 'Désactiver' : 'Activer').setStyle(ticketEnabled ? ButtonStyle.Danger : ButtonStyle.Success);
                  row.components[1].setDisabled(!ticketEnabled);
                  row.components[2].setDisabled(!ticketEnabled);
                  row.components[3].setDisabled(!ticketEnabled || !ticketChannel);
                  await i.update({ embeds: [embed], components: [row] });
              } else if (i.customId === 'config_channel') {
                  const channelSelect = new ChannelSelectMenuBuilder()
                      .setCustomId('select_channel')
                      .setPlaceholder('Sélectionnez un salon')
                      .addChannelTypes(ChannelType.GuildText);
                  const selectRow = new ActionRowBuilder().addComponents(channelSelect);
                  await i.update({ content: 'Sélectionnez le salon de ticket :', embeds: [], components: [selectRow], });
              } else if (i.customId === 'config_category') {
                  const categorySelect = new ChannelSelectMenuBuilder()
                      .setCustomId('select_category')
                      .setPlaceholder('Sélectionnez une catégorie')
                      .addChannelTypes(ChannelType.GuildCategory);
                  const selectRow = new ActionRowBuilder().addComponents(categorySelect);
                  await i.update({ content: 'Sélectionnez la catégorie de ticket :', embeds: [], components: [selectRow] });
              } else if (i.customId === 'select_channel') {
                  const selectedChannel = i.values[0];
                  client.db.set(`ticketChannel_${interaction.guild.id}`, selectedChannel);
                  embed.data.fields = embed.data.fields ? embed.data.fields.filter(field => field.name !== 'Salon de ticket') : [];
                  embed.addFields({ name: 'Salon de ticket', value: `<#${selectedChannel}>` });
                  row.components[3].setDisabled(false);
                  await i.update({ embeds: [embed], components: [row], content: null });
              } else if (i.customId === 'select_category') {
                  const selectedCategory = i.values[0];
                  client.db.set(`ticketCategory_${interaction.guild.id}`, selectedCategory);
                  embed.data.fields = embed.data.fields ? embed.data.fields.filter(field => field.name !== 'Catégorie de ticket') : [];
                  embed.addFields({ name: 'Catégorie de ticket', value: `<#${selectedCategory}>` });
                  await i.update({ embeds: [embed], components: [row], content: null });
              } else if (i.customId === 'send_ticket') {
                  const ticketChannel = client.db.get(`ticketChannel_${interaction.guild.id}`);
                  if (ticketChannel) {
                      const ticketEmbed = new EmbedBuilder()
                          .setTitle('🎫 Ticket 🎫')
                          .setDescription('**Cliquez sur le bouton ci-dessous pour créer un ticket 🎫**')
                          .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                          .setTimestamp()
                          .setColor('#000000');

                      const ticketButton = new ActionRowBuilder()
                          .addComponents(
                              new ButtonBuilder()
                                  .setCustomId('create_ticket')
                                  .setLabel('Créer un ticket')
                                  .setEmoji('📩')
                                  .setStyle(ButtonStyle.Primary)
                          );

                      const channel = interaction.guild.channels.cache.get(ticketChannel);
                      if (channel) {
                          await channel.send({ embeds: [ticketEmbed], components: [ticketButton] });
                          await i.reply({ content: 'L\'embed de ticket a été envoyé avec succès !', ephemeral: true });
                      } else {
                          await i.reply({ content: 'Erreur : Le salon de ticket n\'a pas été trouvé.', ephemeral: true });
                      }
                  } else {
                      await i.reply({ content: 'Erreur : Aucun salon de ticket n\'a été configuré.', ephemeral: true });
                  }
              }
          });

          collector.on('end', () => {
            createCollector();
        });
      }
      createCollector();
    }
  };
