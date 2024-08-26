const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { RankCardBuilder, Font, BuiltInGraphemeProvider } = require('canvacord');
const { getLevelInfo } = require('../../models/level');
const { registerFont } = require('canvas');
Font.loadDefault();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Affiche le rang d\'un membre')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('L\'utilisateur dont vous voulez voir le rang')
                .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('user') || interaction.member;
        const guildId = interaction.guild.id;
        const userId = member.id;

        const levelInfo = await getLevelInfo(guildId, userId);

        const card = new RankCardBuilder()
            .setDisplayName(member.displayName)
            .setUsername("@" + member.user.username)
            .setAvatar(member.user.displayAvatarURL({ format: 'png', size: 256 }))
            .setCurrentXP(levelInfo.xp)
            .setRequiredXP(levelInfo.requiredXP)
            .setLevel(levelInfo.level)
            .setRank(levelInfo.rank)
            .setOverlay(90)
            .setBackground("#808080")
            .setStatus(member.presence?.status || 'offline')
            .setGraphemeProvider(BuiltInGraphemeProvider.FluentEmojiFlat)
            .setProgressCalculator((currentXP, requiredXP) => {
                const progress = (currentXP / requiredXP) * 100;
                return Math.max(0, Math.min(progress, 100));
            })
            .setStyles({
                progressbar: {
                    thumb: {
                        style: {
                            backgroundColor: '#808080'
                        },
                    },
                    track: {
                        style: {
                            backgroundColor: "#faa61a"
                        },
                    },
                },
                statistics: {
                    level: {
                        text: {
                            style: {
                                color: "#faa61a",
                            },
                        },
                    },
                    xp: {
                        text: {
                            style: {
                                color: "#faa61a",
                            },
                        },
                    },
                    rank: {
                        text: {
                            style: {
                                color: "#faa61a",
                            },
                        },
                    },
                },
            });

        const pngBuffer = await card.build({
            format: 'png'
        });

        const attachment = new AttachmentBuilder(pngBuffer, { name: 'rank.png' });

        await interaction.reply({ files: [attachment] });
    },
};
