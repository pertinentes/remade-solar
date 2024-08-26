  const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

  module.exports = {
      data: new SlashCommandBuilder()
          .setName('settings')
          .setDescription('Affiche les paramètres d\'antiraid actifs')
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

      async execute(interaction, client) {
          if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
              return interaction.reply({ content: "Vous n'avez pas la permission de voir les paramètres d'antiraid.", ephemeral: true });
          }

          const guildId = interaction.guild.id;
          const antispamEnabled = client.db.get(`antispam.${guildId}`) || false;
          const antiroleEnabled = client.db.get(`antirole.${guildId}`) || false;
          const antiraidEnabled = client.db.get(`antiraid.${guildId}`) || false;
          const antilinkEnabled = client.db.get(`antilink.${guildId}`) || false;
          const antichannelEnabled = client.db.get(`antichannel.${guildId}`) || false;
          const antibotEnabled = client.db.get(`antibot.${guildId}`) || false;
          const antiinsulteEnabled = client.db.get(`antiinsulte.${guildId}`) || false;

          const settings = [
              { name: 'Anti-Spam', enabled: antispamEnabled },
              { name: 'Anti-Role', enabled: antiroleEnabled },
              { name: 'Anti-Raid', enabled: antiraidEnabled },
              { name: 'Anti-Link', enabled: antilinkEnabled },
              { name: 'Anti-Channel', enabled: antichannelEnabled },
              { name: 'Anti-Bot', enabled: antibotEnabled },
              { name: 'Anti-Insulte', enabled: antiinsulteEnabled }
          ];

          const embed = new EmbedBuilder()
              .setTitle('Paramètres Antiraid')
              .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
              .setTimestamp()
              .setColor('#000000');

          settings.forEach(setting => {
              const status = setting.enabled ? '\x1b[32m✅' : '\x1b[31m❌';
              embed.addFields({
                  name: setting.name,
                  value: `\`\`\`ansi\n${status} ${setting.name}\x1b[0m\n\`\`\``,
                  inline: true
              });
          });

          await interaction.reply({ embeds: [embed] });
      },
  };
