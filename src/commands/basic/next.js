const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Next track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.tracks.data.length) {
			return interaction.reply('There are no next tracks in the queue');
		}

		queue.node.skip();

		interaction.reply('Start playing next track');
	}
};