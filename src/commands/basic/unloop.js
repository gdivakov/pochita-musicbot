const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');
const useUnloop = require('@hooks/useUnloop');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unloop')
		.setDescription('Unloop current track'),
	async execute({ interaction }) {
		const queue = useQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply('There is no track playing');
		}

		useUnloop(interaction.guild.id);

		await interaction.reply('Track was unlooped');
	}
};