const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume a track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply('There is no track playing');
		}

		queue.node.setPaused(false);

		await interaction.reply('Track was resumed');
	}
};