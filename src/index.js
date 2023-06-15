require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { applyToEachCommand } = require('./utils');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { generateDependencyReport } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { prepareSongTitle } = require('./utils');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
});

Init();

function Init() {
    InitCommands();
    InitEvents();
    InitPlayer();
    InitLogging();

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
    client.player = new Player(client);

    await client.player.extractors.loadDefault();

    client.player.events.on('playerStart', (queue, track) => {
        // console.log(track);

        const embed = new EmbedBuilder()
            .setTitle(prepareSongTitle(track))
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .setColor('Yellow')
            //
            .setColor(0x0099FF)
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });            ;

        queue.metadata.channel.send({ embeds: [embed] });
    });

    client.player.events.on('connection', (queue) => {
        queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
            if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
                queue.dispatcher.voiceConnection.configureNetworking();
            }
        });
    });
}

function InitLogging() {
    if (process.env.IS_LOGGING_ENABLED !== 'TRUE') {
        return;
    }

    // Check installed dependencies for
    // @discordjs/voice and discord-player
    console.log(generateDependencyReport());

    client.player.events.on('error', (queue, error) => {
        // Emitted when the player queue encounters error
        console.log(`General player error event: ${error.message}`);
        console.log(error);
    });

    client.player.events.on('playerError', (queue, error) => {
        // Emitted when the audio player errors while streaming audio track
        console.log(`Player error event: ${error.message}`);
        console.log(error);
    });

    client.player.on('debug', async (message) => {
        // Emitted when the player sends debug info
        // Useful for seeing what dependencies, extractors, etc are loaded
        console.log(`General player debug event: ${message}`);
    });

    client.player.events.on('debug', async (queue, message) => {
        // Emitted when the player queue sends debug info
        // Useful for seeing what state the current queue is at
        console.log(`Player debug event: ${message}`);
    });
}