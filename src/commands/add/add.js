const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const { prepareSongTitle } = require('@utils/formatString');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add a song to the end of the queue')
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

		await interaction.followUp(`${prepareSongTitle(track)} added to the queue`);
	},
};
