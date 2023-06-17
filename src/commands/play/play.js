const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { prepareSongTitle } = require('@utils/formatString');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play track by query: direct URL or search string. Queue moves ahead')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('track URL')
				.setRequired(true)),
	async execute({ client, interaction }) {

		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status)
		{
			return interaction.reply(connectionState.reason);
		}

		await interaction.deferReply();

		const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } };
		const trackQuery = interaction.options.getString('query');
		const channel = interaction.member.voice.channel;

		const { track, queue } = await client.player.play(channel, trackQuery, options);

		// In case we have queue ahead
		if (queue.tracks.data.length) {
			// move track to start position
			queue.node.move(queue.tracks.data.length - 1, 0);

			// and play it
			queue.node.skip();
		}

		interaction.followUp(`Started a new track: ${prepareSongTitle(track)}`);
	},
};
