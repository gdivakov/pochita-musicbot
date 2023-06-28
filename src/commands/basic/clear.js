const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Queue will be cleared'),
	async execute({clien, interaction }) {
        const queue = useQueue(interaction.guildId);
        
        if (!queue) {
			return await interaction.reply('Bot isn`t in voice channel');
		}

        queue.clear();
		await interaction.reply('Queue was cleared');
	}
};