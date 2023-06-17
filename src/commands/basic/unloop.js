const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unloop')
		.setDescription('Unloop current track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return interaction.reply('There is no track playing');
		}

		queue.setRepeatMode(0);

		interaction.reply('Track was unlooped');
	}
};