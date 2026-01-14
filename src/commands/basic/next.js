const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const useResume = require('@hooks/useResume');
const useList = require('@hooks/useList');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Next track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);
		const [, handlePrev] = useList(queue);

		if (!queue || !queue.tracks.data.length) {
			return await interaction.reply('There are no next tracks in the queue');
		}

		// Defer reply as PlayerStart event is responsible for handling that
		await interaction.deferReply();
		queue.setMetadata(interaction);

		handlePrev();
		queue.node.skip();
		useResume(interaction.guild.id);
	}
};