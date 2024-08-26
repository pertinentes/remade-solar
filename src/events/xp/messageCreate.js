const { updateXP, getLevelInfo } = require('../../models/level');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const guildId = message.guild.id;
        const userId = message.author.id;

        const { newLevel, levelUp } = await updateXP(guildId, userId);

        if (levelUp) {
            const { xp, level, rank, requiredXP } = await getLevelInfo(guildId, userId);
            message.reply(`Félicitations ! Vous venez de passer au niveau ${newLevel} !`);
        }
    },
};
