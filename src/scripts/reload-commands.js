require('module-alias/register');
const { reloadCommands } = require('@utils/reloadCommands');

// Update (/) commands for all subscribed Guilds'
reloadCommands();