const { SlashCommandBuilder } = require('@discordjs/builders');
// const { prepareSongTitle } = require('@utils/formatString');
const { MIN_PREV_TRACKS_TO_SHOW, MAX_NEXT_TRACKS_TO_SHOW } = require('@consts');
const useTrackList = require('@hooks/useTrackList');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Get a list of songs from the current queue'),
	async execute({ client, interaction }) {
		const preparedlist = useTrackList(interaction.guildId);

		await interaction.reply(`Queue list: \n\t${preparedlist}`);
	}
};
