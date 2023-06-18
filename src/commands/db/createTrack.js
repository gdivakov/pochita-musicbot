const { SlashCommandBuilder } = require('discord.js');
const Track = require('../../db/models/track');
const connectToDB = require('../../scripts/dbconnect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-track')
		.setDescription('Creates a new Track!')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('url')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Title')
				.setAutocomplete(true)),
	async execute({ interaction }) {
		await connectToDB();

		const title = interaction.options.getString('title', true);
		const URL = interaction.options.getString('url', true);

		if (!URL)
		{
			return await interaction.reply('You must specify the URL');
		}

		const track = new Track({ title, URL });

		await track.save();
		await interaction.reply('Track created');
	},
};