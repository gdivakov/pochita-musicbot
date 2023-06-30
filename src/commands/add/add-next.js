const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { prepareSongTitle } = require('@utils/formatString');
const useMoveToStart = require('@hooks/useMoveToStart');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-next')
		.setDescription('Add a song after current track')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Track URL or search string')
				.setRequired(true)),
	async execute({ client, interaction }) {
		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status)
		{
			return await interaction.reply(connectionState.reason);
		}

		await interaction.deferReply();

		const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } };
		const trackQuery = interaction.options.getString('query');
		const channel = interaction.member.voice.channel;

		const { track, queue } = await client.player.play(channel, trackQuery, options);

		useMoveToStart({
			from: queue.tracks.data.length - 1,
			num: 1,
			guildId: interaction.guild.id,
			withSkip:false
		});

		await interaction.followUp(`${prepareSongTitle(track)} added as a new song`);
	},
};
