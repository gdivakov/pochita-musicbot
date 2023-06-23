const { SlashCommandBuilder } = require('discord.js');
const useDatabase = require('@hooks/useDatabase');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-playlist')
		.setDescription('Create a new playlist')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('New playlist title')),
	async execute({ interaction }) {
		const db = useDatabase();
		const title = interaction.options.getString('title', true);

		const { status, errorMessage } = await db.createPlaylist(title);

		if (!status)
		{
			return await interaction.reply(errorMessage);
		}

		await interaction.reply('Playlist created');
	},
};
