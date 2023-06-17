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
			return await interaction.reply(connectionState.reason);
		}

		await interaction.deferReply();

		try {
			await connectToDB();
			const channel = interaction.member.voice.channel;

			for await (const doc of Track.find()) {
				await client.player.play(channel, doc.URL, {
					nodeOptions: {
						leaveOnEnd: false,
						// nodeOptions are the options for guild node (aka your queue in simple word)
						metadata: interaction // we can access this metadata object using queue.metadata later on
					}
				});
			}

			return interaction.followUp('Play all tracks');
		} catch (e) {
			// let's return error if something failed
			return interaction.followUp(`Something went wrong: ${e}`);
		}
	},
};
