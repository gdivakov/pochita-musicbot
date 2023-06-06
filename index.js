const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { applyToEachCommand } = require('./utils');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

dotenv.config();

Init();

function Init() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    InitCommands(client);
    InitEvents(client);

    // Log in to Discord with app's token
    client.login(process.env.DISCORD_TOKEN);
}

function InitCommands(client) {
    client.commands = new Collection();
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    applyToEachCommand(command => client.commands.set(command.data.name, command));
}

function InitEvents(client) {
    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) {
            return
        };

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
}
