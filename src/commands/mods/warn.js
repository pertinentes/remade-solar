const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn un membre')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le pseudo du membre à warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du warn')
                .setRequired(false)),

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: "Vous n'avez pas la permission de warn des membres.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');
        const reason = interaction.options.getString('raison') || 'Pas de raison fournie';

        if (!member) {
            return await interaction.reply({ content: 'Membre non trouvé.', ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            const embed = new EmbedBuilder()
                .setTitle('Warn')
                .setDescription('Tu ne peux pas te warn toi-même !')
                .setColor(0x000000)
                .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
            return await interaction.reply({ embeds: [embed] });
        }
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            const embed = new EmbedBuilder()
                .setTitle('Warn')
                .setDescription('Tu ne peux pas warn cette personne !')
                .setColor(0x000000)
                .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
            return await interaction.reply({ embeds: [embed] });
        }

        const warnId = `WARN-${uuidv4().substring(0, 7)}`;
        const guildId = interaction.guild.id;
        const userId = member.id;

        client.db.push(`warn.${guildId}.${userId}`, {
            id: warnId,
            reason: reason,
            moderator: interaction.user.id,
            timestamp: new Date().toISOString()
        });

        const embed = new EmbedBuilder()
            .setTitle('Warn')
            .setDescription(`\`${member.user.tag}\` **vient d'être warn !**\n\n**Raison :** \`${reason}\`\n\n **Modérateur :** <@${interaction.user.id}>`)
            .setColor(0x000000)
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};