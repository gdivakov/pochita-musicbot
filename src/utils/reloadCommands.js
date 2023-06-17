require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { applyToEachCommand } = require('@utils');

const getRouteByEnvironment = () => {
	const { ENVIRONMENT, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

	if (ENVIRONMENT === 'PRODUCTION')
	{
		return Routes.applicationCommands(DISCORD_CLIENT_ID);
	}

	return Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID);
};

async function reloadCommands() {
	let commands = [];

	applyToEachCommand(command => {
		commands.push(command.data.toJSON());
	});

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// // Construct and prepare an instance of the REST module
		const rest = new REST().setToken(process.env.DISCORD_TOKEN);

		// Fully refresh all commands with the current set
		const data = await rest.put(getRouteByEnvironment(), { body: commands });
		console.log(`Successfully reloaded ${data.length} (/) commands`);
	} catch (error) {
		console.log('Error while reloading (/) commands', error);
	}
}

module.exports = { reloadCommands };