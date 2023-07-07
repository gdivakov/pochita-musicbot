const { SlashCommandBuilder } = require('@discordjs/builders');
const { prepareSongTitle } = require('@utils/formatString');
const useList = require('@hooks/useList');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Get a list of songs from the current queue'),
	async execute({ client, interaction }) {
		const queue = client.player.queues.get(interaction.guild.id);
		const [listState] = useList(queue);
	
		if (!queue) {
			return new Error('Queue error')
		}
	
		const currentTrack = queue.currentTrack || queue.history.tracks.data[0];
		const prevTracksToShowNum = queue.currentTrack ? listState.MIN_PREV_TRACKS : listState.MIN_PREV_TRACKS + 1;
		const prevTracks = queue.history.tracks.data.slice(queue.currentTrack ? 0 : 1, prevTracksToShowNum).reverse().map(prepareSongTitle);
		const nextTracks = queue.tracks.data.slice(0, listState.MAX_NEXT_TRACKS).map(prepareSongTitle);
	
		let displayedQueue = '\t' + prevTracks.join('\n\t') + '\n> ' + prepareSongTitle(currentTrack) + '\n\t' + nextTracks.join('\n\t');
	
		await interaction.reply(`Queue list: \n${displayedQueue}`);
	}
};