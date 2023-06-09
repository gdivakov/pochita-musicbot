

const { Events } = require('discord.js');
const ENVIRONMENT_CONSTS = require('@consts/env');
const { ERROR_MESSAGE } = require('@consts/message');
const { getErrorMessage } = require('@utils/message');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
			return;
		}

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (interaction.isAutocomplete())
			{
				return await command.autocomplete({ client: interaction.client, interaction });
			}

			await command.execute({ client: interaction.client, interaction });
		} catch (error) {
			console.error('InteractionCreate::Execute', error);

			// Show full error in case of development
			const content = process.env.ENVIRONMENT == ENVIRONMENT_CONSTS.DEVELOPMENT ?
				getErrorMessage(error.stack) : ERROR_MESSAGE.COMMAND.DEFAULT_MESSAGE;

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content, ephemeral: true });
			} else {
				await interaction.reply({ content, ephemeral: true });
			}

		}
	},
};