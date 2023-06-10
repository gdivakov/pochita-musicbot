require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { applyToEachCommand } = require('./utils');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { VoiceConnectionStatus } = require('@discordjs/voice');


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
    client.player = new Player(client, {
        ytdlOptions: {
            quality: "highestaudio",
            highWaterMark: 1 << 25
        }
    })

    await client.player.extractors.loadDefault();

    // this event is emitted whenever discord-player starts to play a track
    client.player.events.on('playerStart', (queue, track) => {
        // we will later define queue.metadata object while creating the queue
        // queue.metadata.channel.send(`Started playing **${track.title}**!`);
    });

    client.player.events.on('connection', (queue) => {
        queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
            if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
                queue.dispatcher.voiceConnection.configureNetworking();
            }
        });
    });
}
