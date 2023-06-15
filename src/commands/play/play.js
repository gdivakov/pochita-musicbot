const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice")

// play [url] - Move song from url to the beggining of the queue and play it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play track from URL, queue moves ahead')
        .addStringOption(option =>
            option.setName('url').setDescription('track URL')),
    async execute({ client, interaction }) {
        const channel = interaction.member.voice.channel;

        // Join voice channel // Todo: Join a voice channel only if not already there
        const voiceConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        // const connection = getVoiceConnection(voiceChannelId);

        if (!channel) {
            return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        }

        try {
            await interaction.deferReply();

            const options = { nodeOptions: { leaveOnEnd: false, metadata: interaction } }
            const trackURL = interaction.options.getString('url');

            const { track, queue } = await client.player.play(channel, trackURL, options);

            // In case we have queue ahead
            if (queue.tracks.data.length) {
                // move track to start position
                queue.node.move(queue.tracks.data.length-1, 0);

                // and play it
                queue.node.skip();
            }

            return interaction.followUp(`Successfully started **${track.title}**`);

        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
}
