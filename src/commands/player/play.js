const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice")
const connectToDB = require('../../scripts/dbconnect');
const Track = require('../../db/models/track');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play')
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Play all tracks')) // Temp
        .addSubcommand(subcommand =>
            subcommand
                .setName('track')
                .setDescription('Play track from URL')
                .addStringOption(option =>
                    option.setName('url').setDescription('track URL'))),
    async execute({ client, interaction }) {
        // join voice channel
        const voiceChannelId = interaction.member.voice.channel.id;
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        // const connection = getVoiceConnection(voiceChannelId);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        }

        const trackURL = interaction.options.getString('url'); // we need input/query to play
        // console.log("-------------track", trackURL);
        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {

            if (!trackURL) {
                // Todo: Refactor. Play all tracks
                await connectToDB();

                for await (const doc of Track.find()) {
                    await client.player.play(channel, doc.URL, {
                        nodeOptions: {
                            // nodeOptions are the options for guild node (aka your queue in simple word)
                            metadata: interaction // we can access this metadata object using queue.metadata later on
                        }
                    });
                }

                return interaction.followUp('Play all tracks!');
            }

            const { track } = await client.player.play(channel, trackURL, {
                nodeOptions: {
                    leaveOnEnd: false,
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction // we can access this metadata object using queue.metadata later on
                }
            });

            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            // let's return error if something failed
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
}
