const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const establishVCConnection = (interaction) => {
	const channel = interaction.member.voice.channel;

	if (!channel) {
		return { status: false, reason: 'You are not connected to a voice channel' };
	}

	let VCConnection = getVoiceConnection(channel.guild.id);

	// No connection - try to connect
	if (!VCConnection) {
		// Join voice channel
		joinVoiceChannel({
			channelId: channel.guild.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		});

		VCConnection = getVoiceConnection(channel.guild.id);
	}

	if (!VCConnection) {
		return { status: false, reason: 'Can\'t connect to a voice channel' };
	}

	return { status: true };
};

module.exports = { establishVCConnection };