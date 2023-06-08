require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { applyToEachCommand } = require('./utils');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

Init();

function Init() {
    InitCommands();
    InitEvents();
    InitPlayer();

    // Log in to Discord with app's token
    client.login(process.env.DISCORD_TOKEN);
}

function InitCommands() {
    client.commands = new Collection();
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    applyToEachCommand(command => client.commands.set(command.data.name, command));
}

function InitEvents() {
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

async function InitPlayer() {
    // this is the entrypoint for discord-player based application
    client.player = new Player(client);

    // This method will load all the extractors from the @discord-player/extractor package
    await client.player.extractors.loadDefault();

    // this event is emitted whenever discord-player starts to play a track
    client.player.events.on('playerStart', (queue, track) => {
        // we will later define queue.metadata object while creating the queue
        queue.metadata.channel.send(`Started playing **${track.title}**!`);
    });
}
