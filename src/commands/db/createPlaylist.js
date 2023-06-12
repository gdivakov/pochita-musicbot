const { SlashCommandBuilder } = require('discord.js');
const Playlist = require('../../db/models/playlist');
const connectToDB = require('../../scripts/dbconnect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-playlist')
		.setDescription('Creates a new Playlist!')
    .addStringOption(option =>
      option.setName('title')
          .setDescription('Title')
          .setAutocomplete(true)),
	async execute({ client, interaction }) {
    try {
      await connectToDB();

      const title = interaction.options.getString('title', true); // we need input/query to play

      const playlist = new Playlist({ title });
      await playlist.save();

      console.log("new playlist", playlist);
    } catch (err)
    {
      console.log('Error while creating the playlist: ', err);
      return await interaction.reply('Error while creating the playlist: ', err);
    }

    await interaction.reply('Playlist created!');
  },
};
