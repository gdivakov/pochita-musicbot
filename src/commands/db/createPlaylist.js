const { SlashCommandBuilder } = require('discord.js');
const Playlist = require('@db/models/playlist');
const connectToDB = require('@scripts/dbconnect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-playlist')
		.setDescription('Creates a new Playlist!')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Title')
				.setAutocomplete(true)),
	async execute({ interaction }) {
		await connectToDB();

		const title = interaction.options.getString('title', true);
		const playlist = new Playlist({ title });

		await playlist.save();
		await interaction.reply('Playlist created');
	},
};
