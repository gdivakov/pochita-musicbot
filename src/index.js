require('module-alias/register');
require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { generateDependencyReport, VoiceConnectionStatus } = require('@discordjs/voice');
const { Player } = require('discord-player');
const { applyToEachCommand } = require('@utils');
const { reloadCommands } = require('@utils/reloadCommands');
const PochitaEmbed = require('@classes/TrackCard/PochitaEmbed');
const DeezerExtractor = require('discord-player-deezer').default;
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
	// eslint-disable-next-line no-undef
	client.login(process.env.DISCORD_TOKEN);
}

function InitCommands() {
	client.commands = new Collection();
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	applyToEachCommand(command => client.commands.set(command.data.name, command));

	// Reload dev guild commands
	// eslint-disable-next-line no-undef
	if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
		reloadCommands();
	}
}

function InitEvents() {
	// eslint-disable-next-line no-undef
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

	// Register unofficial deezer extractor
	// Note: be sure to register it before loading the default extractors
	// to make sure any conflicts with discord-player's default attachment extractor is resolved!
	client.player.extractors.register(DeezerExtractor);

	await client.player.extractors.loadDefault();
	client.player.events.on('playerStart', async ({ metadata }, track) => {
		try {
			const embed = new PochitaEmbed(track).prepareSongStartedEmbed();

			const isWaitingForReply = !metadata.replied && metadata.deferred;

			if (isWaitingForReply)
			{
				await metadata.editReply({ embeds: [embed] });
			} else
			{
				await metadata.channel.send({ embeds: [embed] });
			}

		} catch (err) {
			console.log('Error sending embed:', err);
		}
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
	// eslint-disable-next-line no-undef
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
