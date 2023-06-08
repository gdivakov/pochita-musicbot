const { Routes } = require('discord.js');
const { reloadCommands } = require('../utils/reloadCommands');
require('dotenv').config();

// Update development Guild (/) commands
reloadCommands(
    Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_DEV_GUILD_ID),
    data => console.log(`Successfully reloaded ${data.length} (/) commands.`),
    error => console.log('Error while reloading (/) commands', error) 
);