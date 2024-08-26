const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock un salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon à unlock')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le role à unlock')
                .setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de gérer les salons.", ephemeral: true });
        }

        const channel = interaction.options.getChannel('salon');
        const role = interaction.options.getRole('role') || interaction.guild.roles.everyone;

        if (!channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Je n'ai pas la permission de gérer ce salon.", ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(role, { SendMessages: true });

            const unlockEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Unlock')
                .setDescription(`Le rôle \`${role.name}\` a bien été unlock dans le salon ${channel}`)
                .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [unlockEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur s'est produite lors du déverrouillage du salon.", ephemeral: true });
        }
    },
};
