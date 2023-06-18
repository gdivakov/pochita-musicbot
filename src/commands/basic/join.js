const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join voice channel'),
	async execute({ interaction }) {
		// const voiceConnection = joinVoiceChannel({
		//   channelId: interaction.member.voice.channel.id,
		//   guildId: interaction.guildId,
		//   adapterCreator: interaction.guild.voiceAdapterCreator
		// });

		await interaction.reply('Joined');
	},
};
