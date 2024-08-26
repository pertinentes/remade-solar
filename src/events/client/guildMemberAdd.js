const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const welcomeEnabled = client.db.get(`welcomeEnabled_${member.guild.id}`) || false;
        const welcomeChannelId = client.db.get(`welcomeChannel_${member.guild.id}`);

        if (!welcomeEnabled || !welcomeChannelId) return;

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        if (!welcomeChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('Un nouveau membre vient d\'arriver')
            .setDescription(`**<@${member.id}> vient de rejoindre le serveur\n\n👋 Bienvenue à toi sur** \`${member.guild.name}\`\n\n👤 **Nous sommes maintenant \`${member.guild.memberCount}\` membres**`)
            .setFooter({ text: 'SolarBot' })
            .setTimestamp()
            .setImage('https://media.discordapp.net/attachments/972186340269649951/1249800276081381406/banniere_solarbot2.jpg?ex=66ca2db5&is=66c8dc35&hm=63b69c8a7f5dc17020c74a3bfb630d2ab5d6ff03cf17228fa41b4ce0e4c7a1a6&format=webp&');

        await welcomeChannel.send({ content: `<@${member.id}>`, embeds: [embed] });
    },
};