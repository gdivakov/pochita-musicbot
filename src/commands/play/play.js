const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { QueryType } = require('discord-player');
// const SUPPORTED_PLATFORMS = require('@consts/platforms');
const useMoveToStart = require('@hooks/useMoveToStart');

// const PREFFERED_SEARCH_PLATFORM = SUPPORTED_PLATFORMS.YOUTUBE;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play track by query: direct URL or search string. Queue moves ahead')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Track URL or search string')
				.setRequired(true)),
	async execute({ client, interaction }) {

		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status) {
			return await interaction.reply(connectionState.reason);
		}

		const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } };
		const trackQuery = interaction.options.getString('query');
		const channel = interaction.member.voice.channel;

		await interaction.deferReply();

		const isDirectURL = trackQuery.indexOf('https://') === 0;
		const searchEngine = isDirectURL ? QueryType.AUTO : QueryType.YOUTUBE_SEARCH;

		const searchResult = await client.player.search(trackQuery, { requestedBy: interaction.user, searchEngine });

		if (!searchResult.hasTracks()) {
			await interaction.editReply(`We found no tracks for ${trackQuery}!`);
			return;
		}

		const { queue } = await client.player.play(channel, searchResult, options);

		// PlayerStart event is responsible for handling reply
		queue.setMetadata(interaction);

		// Move all received tracks to start of the queue
		useMoveToStart({
			from: queue.tracks.data.length - 1,
			num: 1,
			guildId: interaction.guild.id,
		});
	}
};
