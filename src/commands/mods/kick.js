const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

  module.exports = {
      data: new SlashCommandBuilder()
          .setName('kick')
          .setDescription('Kick une personne')
          .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
          .addUserOption(option =>
              option.setName('membre')
                  .setDescription('Le membre à kick')
                  .setRequired(true))
          .addStringOption(option =>
              option.setName('raison')
                  .setDescription('La raison du kick')
                  .setRequired(false)),

      async execute(interaction, client) {
          if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
              return interaction.reply({ content: "Vous n'avez pas la permission de kick des membres.", ephemeral: true });
          }

          const member = interaction.options.getMember('membre');
          const reason = interaction.options.getString('raison') || 'Pas de raison fournie';

          if (!member) {
              return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
          }

          if (!member.kickable) {
              return await interaction.reply({ content: 'Ce membre ne peut pas être kick', ephemeral: true });
          }

          try {
              await member.kick(reason);

              const embed = {
                  color: 0x000000,
                  title: 'Kick',
                  description: `\`${member.user.tag}\` **vient d'être kick !**\n\n**Raison :** \`${reason}\`\n\n **Modérateur :** <@${interaction.user.id}>`,
                  footer: {
                      text: 'SolarBot',
                      icon_url: interaction.client.user.displayAvatarURL(),
                  },
                  timestamp: new Date(),
              };

              await interaction.reply({ embeds: [embed] });
          } catch (error) {
              console.error(error);
              await interaction.reply({ content: 'Une erreur est survenue lors du kick.', ephemeral: true });
          }
      },
  };
