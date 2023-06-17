const { SlashCommandBuilder } = require('@discordjs/builders');
const { useHistory } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prev')
		.setDescription('Previous track'),
	async execute({ interaction }) {
		const history = useHistory(interaction.guild.id);

		if (!history || !history.tracks.data.length) {
			return interaction.reply('There are no previous tracks in the queue');
		}

		await history.previous();

		interaction.reply('Start playing previous track');
	}
};