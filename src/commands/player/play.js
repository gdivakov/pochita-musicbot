const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')

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

}
