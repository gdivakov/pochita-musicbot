const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { SEARCH_TYPES } = require('@consts/search');
const usePlatform = require('@hooks/usePlatform');
const useUnloop = require('@hooks/useUnloop');
const useMoveToStart = require('@hooks/useMoveToStart');
const useResume = require('@hooks/useResume');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play track by query: direct URL or search string. Queue moves ahead')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Track URL or search string')
				.setRequired(true)),
	async execute({ client, interaction }) {

		const [getCurrentPlatform] = usePlatform();

		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status) {
			return await interaction.reply(connectionState.reason);
		}

		const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } };
		const trackQuery = interaction.options.getString('query');
		const channel = interaction.member.voice.channel;

		await interaction.deferReply();
		useUnloop(interaction.guild.id);

		const isDirectURL = trackQuery.indexOf('https://') === 0;
		const searchEngine = isDirectURL ? QueryType.AUTO : getCurrentPlatform();

		const searchResult = await client.player.search(trackQuery, { requestedBy: interaction.user, searchEngine });

		if (!searchResult.hasTracks()) {
			return await interaction.editReply(`We found no tracks for ${trackQuery}!`);
		}

		const { queue } = await client.player.play(channel, searchResult, options);

		// PlayerStart event is responsible for handling reply
		queue.setMetadata(interaction);

		//Unpause if pauseMode is true
		useResume(interaction.guild.id);

		// Move all received tracks to start of the queue
		useMoveToStart({
			from: queue.tracks.data.length - 1,
			num: 1,
			guildId: interaction.guild.id,
		});
	}
};
