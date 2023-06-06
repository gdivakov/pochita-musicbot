const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const { applyToEachCommand } = require('./utils');

dotenv.config();

const commands = [];

applyToEachCommand(command => {
  commands.push(command.data.toJSON());
})

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Update dev guild if env is a dev and all subscribed guilds if it's a prod
    const route = process.env.DISCORD_ENVIRONMENT === 'DEV' ?
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID) :
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);

		// Fully refresh all commands with the current set
		const data = await rest.put(route, { body: commands });

		console.log(`Successfully reloaded ${data.length}
    application (/) commands for ${process.env.DISCORD_ENVIRONMENT} env.`);
	} catch (error) {
		console.error(error);
	}
})();