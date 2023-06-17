const { Events } = require('discord.js');
const ENVIRONMENT_CONSTS = require('@consts/env');
const MESSAGES_CONSTS = require('@consts/message');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand())
		{
			return;
		}

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute({ client: interaction.client, interaction });
		} catch (error) {
			console.error(error);

			// Show full error in case of development
			const content = process.env.ENVIRONMENT == ENVIRONMENT_CONSTS.DEVELOPMENT ?
				error.stack : MESSAGES_CONSTS.COMMAND_ERROR_MESSAGE;

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content, ephemeral: true });
			} else {
				await interaction.reply({ content, ephemeral: true });
			}
		}
	},
};