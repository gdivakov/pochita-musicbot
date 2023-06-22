const { SlashCommandBuilder } = require('discord.js');
const Track = require('@db/models/track');
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

		const choices = await db.getPlaylists().map(({ title } => title));
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));

		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute({ interaction }) {
		const db = useDatabase();
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.currentTrack) {
			return await interaction.reply('No active track found');
		}

		db.saveTrack(queue.currentTrack)
		// const { url: URL, title }

		// db.saveTrack({ URL, title, playlist });

		await interaction.reply('Track saved');
	},
};