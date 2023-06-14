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
  async execute({ client, interaction }) {
    try {
      await connectToDB();

      const title = interaction.options.getString('title', true); // we need input/query to play
      const URL = interaction.options.getString('url', true); // we need input/query to play

      if (!URL)
      {
        return await interaction.reply('You must specify the URL!');
      }

      const track = new Track({ title, URL });
      await track.save();

      console.log("new Track", Track);
    } catch (err) {
      console.log('Error while creating the Track: ', err);
      return await interaction.reply('Error while creating the Track: ', err);
    }

    await interaction.reply('Track created!');
  },
};