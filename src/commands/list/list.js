const { SlashCommandBuilder } = require('@discordjs/builders');
const { prepareSongTitle } = require('@utils/formatString');
const { PREV_TRACKS_TO_SHOW_NUM, NEXT_TRACKS_TO_SHOW_NUM } = require('@consts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Get a list of songs from the current queue'),
	async execute({ client, interaction }) {
		const queue = client.player.queues.get(interaction.guildId);

		if(!queue) {
			return interaction.reply('There is no queue');
		}

		const prevTracks = queue.history.tracks.data.slice(0, PREV_TRACKS_TO_SHOW_NUM).reverse().map(prepareSongTitle).join('\n\t');
		const currentTrack = queue.currentTrack;
		const nextTracks = queue.tracks.data.slice(0, NEXT_TRACKS_TO_SHOW_NUM).map(prepareSongTitle).join('\n\t');

		const displayedQueue = '\t' + prevTracks + '\n' + '> ' + prepareSongTitle(currentTrack) + '\n\t' + nextTracks;

		interaction.reply(`Queue list: \n${displayedQueue}`);
	}

};
