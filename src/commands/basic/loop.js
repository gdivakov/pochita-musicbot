const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop current track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return interaction.reply('There is no track playing');
		}

		queue.setRepeatMode(1);

		await interaction.reply('Track was looped');
	}
};