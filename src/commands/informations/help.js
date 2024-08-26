const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Afficher toutes les commandes du bot')
        .addStringOption(option =>
            option.setName('commande')
                .setDescription('Commande spécifique à afficher')
                .setRequired(false)
                .setAutocomplete(true)),
    async execute(interaction, client) {
        const commandName = interaction.options.getString('commande');

        if (commandName) {
            const commandHelp = getCommandHelp(commandName);
            if (commandHelp) {
                const helpEmbed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Commandes help')
                    .setDescription(`Nom: \`${commandName}\`\nDescription: \`${commandHelp.description}\`\nPermission require: \`${commandHelp.permission}\`\nCommande en DM : \`${commandHelp.dmEnabled}\`\nCategorie : \`${commandHelp.category}\``)
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.reply({ embeds: [helpEmbed] });
            } else {
                return interaction.reply({ content: 'Commande non trouvée.', ephemeral: true });
            }
        }

        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Commandes')
            .setDescription(`Commandes disponibles: \`${client.commands.size}\`\nCatégorie disponibles: \`6\``)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'ℹ️ Information', value: '`bot-info` **: Voir les informations du bot**\n`help` **: Afficher toutes les commandes du bot**\n`ping` **: Affiche la latence du bot**', inline: false },
                { name: '🛡️ Administration', value: '`anti-bot` **: Paramètre l\'anti-bot**\n`anti-insulte` **: Paramètre l\'anti-insulte**\n`anti-link` **: Paramètre l\'anti-link**\n`anti-raid` **: Pour activer ou désactiver l\'anti-raid**\n`anti-spam` **: Paramètre l\'anti-spam**\n`anti-channel` **: Paramètre l\'anti-channel**\n`anti-role` **: Paramètre l\'anti-role**\n`settings` **: Affiche les paramètres d\'antiraid actifs**\n`bienvenue` **: Système de bienvenue**\n`systeme-suggestion` **: Activer/Désactiver le système de suggestion sur le serveur**\n`ticket` **: Système de ticket**\n`sanctions` **: Définir la sanction pour les anti-raid**', inline: false },
                { name: '🔨 Modération', value: '`ban` **: Bannir une personne**\n`clear` **: Supprimer un certain nombre de message d\'un salon**\n`kick` **: Kick une personne**\n`lock` **: Lock un salon**\n`mute` **: Mute un membre**\n`unban` **: Unban une personne**\n`unlock` **: Unlock un salon**\n`unmute` **: Unmute un membre**\n`unwarn` **: Unwarn un membre**\n`warn` **: Warn un membre**\n`warnlist` **: Affiche les warns d\'un membre**\n`whitelist` **: Ajouter un utilisateur à la whitelist**', inline: false },
                { name: '🛠️ Fonctionnalité', value: '`hype` **: Envoyer un message de hype**\n`report` **: Report/Signaler un utilisateur**\n`server-info` **: Voir les informations du serveur**\n`suggestion` **: Faire une suggestion sur le serveur**\n`user-info` **: Voir les informations d\'un utilisateur**', inline: false },
                { name: '👥 Equipe SolarBot', value: '`blacklist-liste` **: Affiche la liste des utilisateurs blacklist**\n`blacklist` **: Blacklist un utilisateur**\n`reponse-recrutement` **: Répondre à une candidature**\n`reponse-report` **: Répondre à un report**\n`server-invite` **: Obtenir une invitation à un serveur via un ID**\n`unblacklist` **: Unblacklist un utilisateur**\n`unwhitelist` **: Retirer un utilisateur de la whitelist**', inline: false },
                { name: '📊 Expérience', value: '`leaderboard` **: Donne le classement du sevreur en fonction de l\'xp**\n`rank` **: Donner l\'xp d\'un membre**', inline: false }
            )
            .setFooter({ text: 'SolarBot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    },
};

function getCommandHelp(commandName) {
    const helpMessages = {
        'bot-info': {
            description: 'Voir les informations du bot',
            permission: 'Aucune',
            dmEnabled: 'Oui',
            category: 'ℹ️ Information'
        },
        'help': {
            description: 'Afficher toutes les commandes du bot',
            permission: 'Aucune',
            dmEnabled: 'Oui',
            category: 'ℹ️ Information'
        },
        'ping': {
            description: 'Affiche la latence du bot',
            permission: 'Aucune',
            dmEnabled: 'Oui',
            category: 'ℹ️ Information'
        },
        'anti-bot': {
            description: 'Paramètre l\'anti-bot',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-insulte': {
            description: 'Paramètre l\'anti-insulte',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-link': {
            description: 'Paramètre l\'anti-link',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-raid': {
            description: 'Pour activer ou désactiver l\'anti-raid',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-spam': {
            description: 'Paramètre l\'anti-spam',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-channel': {
            description: 'Paramètre l\'anti-channel',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'anti-role': {
            description: 'Paramètre l\'anti-role',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'settings': {
            description: 'Affiche les paramètres d\'antiraid actifs',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'bienvenue': {
            description: 'Système de bienvenue',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'systeme-suggestion': {
            description: 'Activer/Désactiver le système de suggestion sur le serveur',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'ticket': {
            description: 'Système de ticket',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'sanctions': {
            description: 'Définir la sanction pour les anti-raid',
            permission: 'ManageGuild',
            dmEnabled: 'Non',
            category: '🛡️ Administration'
        },
        'ban': {
            description: 'Bannir une personne',
            permission: 'BanMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'clear': {
            description: 'Supprimer un certain nombre de message d\'un salon',
            permission: 'ManageMessages',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'kick': {
            description: 'Kick une personne',
            permission: 'KickMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'lock': {
            description: 'Lock un salon',
            permission: 'ManageChannels',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'mute': {
            description: 'Mute un membre',
            permission: 'ModerateMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'unban': {
            description: 'Unban une personne',
            permission: 'BanMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'unlock': {
            description: 'Unlock un salon',
            permission: 'ManageChannels',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'unmute': {
            description: 'Unmute un membre',
            permission: 'ModerateMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'unwarn': {
            description: 'Unwarn un membre',
            permission: 'ModerateMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'warn': {
            description: 'Warn un membre',
            permission: 'ModerateMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'warnlist': {
            description: 'Affiche les warns d\'un membre',
            permission: 'ModerateMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'whitelist': {
            description: 'Ajouter un utilisateur à la whitelist',
            permission: 'BanMembers',
            dmEnabled: 'Non',
            category: '🔨 Modération'
        },
        'hype': {
            description: 'Envoyer un message de hype',
            permission: 'MentionEveryone',
            dmEnabled: 'Non',
            category: '🛠️ Fonctionnalité'
        },
        'report': {
            description: 'Report/Signaler un utilisateur',
            permission: 'Aucune',
            dmEnabled: 'Non',
            category: '🛠️ Fonctionnalité'
        },
        'server-info': {
            description: 'Voir les informations du serveur',
            permission: 'Aucune',
            dmEnabled: 'Non',
            category: '🛠️ Fonctionnalité'
        },
        'suggestion': {
            description: 'Faire une suggestion sur le serveur',
            permission: 'Aucune',
            dmEnabled: 'Non',
            category: '🛠️ Fonctionnalité'
        },
        'user-info': {
            description: 'Voir les informations d\'un utilisateur',
            permission: 'Aucune',
            dmEnabled: 'Oui',
            category: '🛠️ Fonctionnalité'
        },
        'blacklist-liste': {
            description: 'Affiche la liste des utilisateurs blacklist',
            permission: 'Administrator',
            dmEnabled: 'Oui',
            category: '👥 Equipe SolarBot'
        },
        'blacklist': {
            description: 'Blacklist un utilisateur',
            permission: 'Administrator',
            dmEnabled: 'Oui',
            category: '👥 Equipe SolarBot'
        },
        'reponse-recrutement': {
            description: 'Répondre à une candidature',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '👥 Equipe SolarBot'
        },
        'reponse-report': {
            description: 'Répondre à un report',
            permission: 'Administrator',
            dmEnabled: 'Non',
            category: '👥 Equipe SolarBot'
        },
        'server-invite': {
            description: 'Obtenir une invitation à un serveur via un ID',
            permission: 'Administrator',
            dmEnabled: 'Oui',
            category: '👥 Equipe SolarBot'
        },
        'unblacklist': {
            description: 'Unblacklist un utilisateur',
            permission: 'Administrator',
            dmEnabled: 'Oui',
            category: '👥 Equipe SolarBot'
        },
        'unwhitelist': {
            description: 'Retirer un utilisateur de la whitelist',
            permission: 'BanMembers',
            dmEnabled: 'Non',
            category: '👥 Equipe SolarBot'
        },
        'leaderboard': {
            description: 'Donne le classement du serveur en fonction de l\'xp',
            permission: 'Aucune',
            dmEnabled: 'Non',
            category: '📊 Expérience'
        },
        'rank': {
            description: 'Donner l\'xp d\'un membre',
            permission: 'Aucune',
            dmEnabled: 'Non',
            category: '📊 Expérience'
        }
    };
    return helpMessages[commandName] || null;
}
