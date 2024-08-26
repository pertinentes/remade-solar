const Discord = require('discord.js');
const config = require("./config");
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const db = require('quick.db');
const client = new Discord.Client({ 
    intents: 53608447,
});

client.db = db;
client.commands = new Discord.Collection();

function loadCommands(dir) {
    try {
        const commandFolders = fs.readdirSync(dir);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                try {
                    const command = require(`${dir}/${folder}/${file}`);
                    if (command.data && command.data.name) {
                        client.commands.set(command.data.name, command);
                    } else {
                        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
                    }
                } catch (error) {
                    console.error(`Error loading command ${file}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error loading commands:', error);
    }
}

loadCommands('./src/commands');

function loadEvents(dir) {
    try {
        const eventFolders = fs.readdirSync(dir);
        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of eventFiles) {
                try {
                    const event = require(`${dir}/${folder}/${file}`);
                    if (event.once) {
                        client.once(event.name, (...args) => {
                            try {
                                event.execute(...args, client);
                            } catch (error) {
                                console.error(`Error executing event ${event.name}:`, error);
                            }
                        });
                    } else {
                        client.on(event.name, (...args) => {
                            try {
                                event.execute(...args, client);
                            } catch (error) {
                                console.error(`Error executing event ${event.name}:`, error);
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error loading event ${file}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

loadEvents('./src/events');

client.on('ready', () => {
    const rest = new REST({ version: '10' }).setToken(client.token);

    (async () => {
        try {
            const commands = [];
            client.commands.forEach((command) => {
                commands.push(command.data.toJSON());
            });

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error('Error registering application commands:', error);
        }
    })();
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----');
    console.log(promise);
    console.log('----- Reason -----');
    console.log(reason);
});

process.on('uncaughtException', (error) => {
    console.log('----- Uncaught Exception -----');
    console.log(error);
});

client.on('error', (error) => {
    console.error('Discord client error:', error);
});

client.login(config.token).catch(error => {
    console.error('Error logging in:', error);
});
