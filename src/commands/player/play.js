const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Join voice channel')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song Link')
                .setAutocomplete(true)),
    async execute({ client, interaction }) {
        // join voice channel
        const voiceChannelId = interaction.member.voice.channel.id;
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        // const connection = getVoiceConnection(voiceChannelId);        

        // await interaction.reply('Joined!');

        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        }

        const query = interaction.options.getString('query', true); // we need input/query to play

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {
            const { track } = await client.player.play(channel, query, {
                nodeOptions: {
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
