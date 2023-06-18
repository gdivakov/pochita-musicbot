const { SlashCommandBuilder } = require('@discordjs/builders');
const { establishVCConnection } = require('@utils/voice');
const connectToDB = require('@scripts/dbconnect');
const Track = require('@db/models/track');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play-all')
		.setDescription('Play all tracks'),
	async execute({ client, interaction }) {
		const connectionState = establishVCConnection(interaction);

		if (!connectionState.status) {
			return interaction.reply(connectionState.reason);
		}

		await connectToDB();

		await interaction.deferReply();

		for await (const doc of Track.find()) {
			await client.player.play(interaction.member.voice.channel, doc.URL, {
				nodeOptions: {
					leaveOnEnd: false,
					metadata: interaction
				}
			});
		}

		await interaction.followUp('Play all tracks');
	},
};
