const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause a track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply('There is no track playing');
		}

		queue.node.setPaused(true);

		await interaction.reply('Track was paused');
	}
};