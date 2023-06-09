const { SlashCommandBuilder } = require('@discordjs/builders');
const {joinVoiceChannel} = require('@discordjs/voice')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join voice channel'),
	async execute({ interaction }) {
		joinVoiceChannel({
		  channelId: interaction.member.voice.channel.id,
		  guildId: interaction.guildId,
		  adapterCreator: interaction.guild.voiceAdapterCreator
		});
		
		await interaction.reply('Joined');
	},
};
