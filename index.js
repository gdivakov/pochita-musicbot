const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function Initialize()
{
    client.commands = new Collection();

    InitializeCommands();

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, interaction => {
        if (!interaction.isChatInputCommand()) 
        {
            return;
        }        
        
        console.log(interaction);
    }); 
    
    // Log in to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN);    
    
}

function InitializeCommands()
{
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }    
}

Initialize();