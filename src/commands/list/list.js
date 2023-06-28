const { SlashCommandBuilder } = require('@discordjs/builders');
const { prepareSongTitle } = require('@utils/formatString');
const { MIN_PREV_TRACKS_TO_SHOW, MAX_NEXT_TRACKS_TO_SHOW } = require('@consts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Get a list of songs from the current queue'),
	async execute({ client, interaction }) {

		const queue = client.player.queues.get(interaction.guildId);

		if(!queue) {
			return await interaction.reply('There is no queue');
		}

		const currentTrack = queue.currentTrack || queue.history.tracks.data[0];

		const prevTracksToShowNum = queue.currentTrack ? MIN_PREV_TRACKS_TO_SHOW : MIN_PREV_TRACKS_TO_SHOW + 1;

		const prevTracks = queue.history.tracks.data.slice(queue.currentTrack ? 0 : 1, prevTracksToShowNum).reverse().map(prepareSongTitle).join('\n\t');
		const nextTracks = queue.tracks.data.slice(0, MAX_NEXT_TRACKS_TO_SHOW).map(prepareSongTitle).join('\n\t');

		let displayedQueue = '\t' + prevTracks + '\n> ' + prepareSongTitle(currentTrack) + '\n\t' + nextTracks;

		await interaction.reply(`Queue list: \n${displayedQueue}`);
	}
};
