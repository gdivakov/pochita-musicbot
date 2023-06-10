const { REST } = require('discord.js');
const { applyToEachCommand } = require('.');

async function reloadCommands(route, onSuccess, onError) {
    const commands = [];

    applyToEachCommand(command => {
        commands.push(command.data.toJSON());
    });

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        // Fully refresh all commands with the current set
        const data = await rest.put(route, { body: commands });

        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

module.exports = { reloadCommands };