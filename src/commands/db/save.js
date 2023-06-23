const { SlashCommandBuilder } = require('discord.js');
const useDatabase = require('@hooks/useDatabase');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save')
		.setDescription('Save current track to a playlist')
		.addStringOption(option =>
			option.setName('playlist')
				.setRequired(true)
				.setDescription('Select the playlist')
				.setAutocomplete(true)),
	async autocomplete({ interaction }) {
		const focusedValue = interaction.options.getFocused();
		const db = useDatabase();

		const choices = await db.getPlaylists();
		const filtered = choices.filter(choice => choice.title.startsWith(focusedValue));

		await interaction.respond(
			filtered.map(({ title, id }) => ({ name: title, value: id })),
		);
	},
	async execute({ interaction }) {
		const db = useDatabase();
		const queue = useQueue(interaction.guild.id);
		const selectedPlaylistId = interaction.options.getString('playlist');

		if (!queue || !queue.currentTrack) {
			return await interaction.reply('No active track found');
		}

		if (!selectedPlaylistId)
		{
			return await interaction.reply('No playlist selected');
		}

		await db.saveTrack(queue.currentTrack, selectedPlaylistId);

		await interaction.reply('Track saved');
	},
};