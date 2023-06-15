const { REST } = require('discord.js');
const { applyToEachCommand } = require('@utils');

const COMMANDS_TO_UPDATE =
[
    'play',
    'play-all',
    'list'
];

async function reloadCommands(route, onSuccess, onError) {
    let commands = [];

    applyToEachCommand(command => {
        commands.push(command.data.toJSON());
    });

    // Update specific commands
    // commands = commands.filter(command => COMMANDS_TO_UPDATE.includes(command.name));

    console.log('commands to update', commands);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        // Fully refresh all commands with the current set
        const data = await rest.put(route, { body: commands });
        console.log(data);
        onSuccess(data);
    } catch (error) {
        onError(error);
    }
}

module.exports = { reloadCommands };