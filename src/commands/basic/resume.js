const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const useResume = require('@hooks/useResume');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume a track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);
		console.log('interaction', interaction);
		if (!queue) {
			return await interaction.reply('There is no track playing');
		}

		useResume(interaction.guild.id);

		await interaction.reply('Track was resumed');
	}
};