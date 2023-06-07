const dotenv = require('dotenv');
const path = require('node:path');
const fs = require('node:fs');
const { applyToEachCommand } = require('./utils');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

dotenv.config();

Init();

function Init() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    InitCommands(client);
    InitEvents(client);

    // Log in to Discord with app's token
    client.login(process.env.DISCORD_TOKEN);
}

function InitCommands(client) {
    client.commands = new Collection();
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    applyToEachCommand(command => client.commands.set(command.data.name, command));
}

function InitEvents(client) {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
            continue;
        }

        client.on(event.name, (...args) => event.execute(...args));
    }
}
