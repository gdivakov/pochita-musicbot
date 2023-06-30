const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const useDatabase = require('@hooks/useDatabase');
const { useQueue } = require('discord-player');
const useResume = require('@hooks/useResume');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-playlist')
		.setDescription('Play playlist')
		.addStringOption(option =>
			option.setName('playlist')
				.setDescription('Select playlist to play')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete({ interaction }) {
		const focusedValue = interaction.options.getFocused();
		const db = useDatabase();

		const choices = await db.getPlaylists();
		const filtered = choices.filter(choice => choice.title.startsWith(focusedValue));

		await interaction.respond(
			filtered.map(({ title }) => ({ name: title, value: title })),
		);
	},
	async execute({ client, interaction }) {

		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status) {
			return await interaction.reply(connectionState.reason);
		}

		const selectedPlaylistTitle = interaction.options.getString('playlist');

		if (!selectedPlaylistTitle) {
			return await interaction.reply('No playlist selected');
		}

		await interaction.deferReply();

		const queue = useQueue(interaction.guild.id);
		const db = useDatabase();

		const playlistTracks = await db.getPlaylistTracks(selectedPlaylistTitle);

		if (!playlistTracks.length)
		{
			return await interaction.editReply(`Playlist is empty`);
		}

		// Clear before playing next playlist
		if (queue)
		{	
			queue.tracks.clear();
		}

		for await (const doc of playlistTracks) {
			await client.player.play(interaction.member.voice.channel, doc.URL, {
				nodeOptions: {
					leaveOnEnd: false,
					metadata: interaction
				}
			});
		}

		if (queue)
		{
			queue.setMetadata(interaction);
			return queue.node.skip();
		}

		// Resume is case of paused
		useResume(interaction.guild.id);
	}
};
