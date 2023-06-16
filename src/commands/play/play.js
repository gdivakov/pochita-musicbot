const { SlashCommandBuilder } = require("@discordjs/builders")
const { establishVCConnection } = require('@utils/voice');

// play [url] - Move song from url to the beggining of the queue and play it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play track from URL, queue moves ahead')
        .addStringOption(option =>
            option.setName('url')
            .setDescription('track URL')
            .setRequired(true)),
    async execute({ client, interaction }) {

        const connectionState = establishVCConnection(interaction);

        if (!connectionState.status)
        {
            return await interaction.reply(connectionState.reason);;
        };

        try {
            await interaction.deferReply();

            const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } }
            const trackURL = interaction.options.getString('url');
            const channel = interaction.member.voice.channel;

            const { track, queue } = await client.player.play(channel, trackURL, options);

            // In case we have queue ahead
            if (queue.tracks.data.length) {
                // move track to start position
                queue.node.move(queue.tracks.data.length - 1, 0);

                // and play it
                queue.node.skip();
            }

            return interaction.followUp(`Started a new track`);

        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
}
