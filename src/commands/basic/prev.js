const { SlashCommandBuilder } = require('@discordjs/builders');
const { useHistory, useQueue } = require('discord-player');
const useResume = require('@hooks/useResume');
const useList = require('@hooks/useList');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prev')
		.setDescription('Previous track'),
	async execute({ interaction }) {
		const history = useHistory(interaction.guild.id);
		const queue = useQueue(interaction.guild.id);
		const [, , handleNext] = useList(queue);

		if (!history || !history.tracks.data.length) {
			return await interaction.reply('There are no previous tracks in the queue');
		}

		// Defer reply as PlayerStart event is responsible for handling that
		await interaction.deferReply();
		queue.setMetadata(interaction);

		handleNext();
		await history.previous();
		useResume(interaction.guild.id);
	}
};