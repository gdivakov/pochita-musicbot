const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Bot will exit from voice channel'),
	async execute({client, interaction }) {
        const channel = interaction.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);

        if (!connection) {
			return await interaction.reply('You aren`n in voice channel');
		}
        
        client.player.voiceUtils.disconnect(connection);
		await interaction.reply('Bot disconnected from voice channel');
	}
};