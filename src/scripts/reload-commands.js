require('module-alias/register')

const { Routes } = require('discord.js');
const { reloadCommands } = require('@utils/reloadCommands');
require('dotenv').config();

// Update all subscribed Guilds' (/) commands
reloadCommands(
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
    data => console.log(`Successfully reloaded ${data.length} (/) commands for client id: ${process.env.DISCORD_CLIENT_ID}.`),
    error => console.log('Error while reloading (/) commands', error)
);