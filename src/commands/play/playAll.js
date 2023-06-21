const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { useQueue } = require('discord-player');
const useResume = require('@hooks/useResume');
const connectToDB = require('@scripts/dbconnect');
const Track = require('@db/models/track');
const useMoveToStart = require('@hooks/useMoveToStart');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-all')
		.setDescription('Play all tracks'),
	async execute({ client, interaction }) {
		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status) {
			return interaction.reply(connectionState.reason);
		}

		await connectToDB();
		await interaction.deferReply();

		const guildId = interaction.guild.id;
		let queue = useQueue(guildId);

		const allTracks = await Track.find();

		// If currentTrack !== null we must skip it
		const withSkip = queue && queue.currentTrack;

		for await (const doc of allTracks) {
			await client.player.play(interaction.member.voice.channel, doc.URL, {
				nodeOptions: {
					leaveOnEnd: false,
					metadata: interaction
				}
			});
		}

		// No need to perform further actions if we don't have queue
		if (!queue)
		{
			return;
		}

		queue.setMetadata(interaction);

		// Move all received tracks to start of the queue
		useMoveToStart({
			from: queue.tracks.data.length - allTracks.length,
			num: allTracks.length,
			guildId,
			withSkip
		});

		// Resume is case of paused
		useResume(guildId);
	},
};
