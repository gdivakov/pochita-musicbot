const { SlashCommandBuilder } = require("@discordjs/builders")
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice")
const connectToDB = require('@scripts/dbconnect');
const Track = require('@db/models/track');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play-all')
    .setDescription('Play all tracks'),
  async execute({ client, interaction }) {
    // const connection = getVoiceConnection(voiceChannelId);
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
    }

    // join voice channel
    const voiceChannelId = channel.id;
    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });


    await interaction.deferReply();

    try {
      await connectToDB();

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
}
