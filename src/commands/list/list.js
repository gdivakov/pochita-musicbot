const { SlashCommandBuilder } = require("@discordjs/builders");

const PREV_TRACKS_TO_SHOW_NUM = 3;
const NEXT_TRACKS_TO_SHOW_NUM = 6;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Get a list of songs from the current queue"),
    async execute({ client, interaction }) {
        try {
            const queue = client.player.queues.get(interaction.guildId);

            const prevTracks = queue.history.tracks.data.slice(0, PREV_TRACKS_TO_SHOW_NUM).reverse().join('\n\t');
            const currentTrack = queue.currentTrack;
            const nextTracks = queue.tracks.data.slice(0, NEXT_TRACKS_TO_SHOW_NUM).join('\n\t');

            const displayedQueue = '\t' + prevTracks + '\n' + '> **' + currentTrack + '**\n\t' + nextTracks;

            await interaction.reply(`Queue list: \n${displayedQueue}`)
        } catch(e) {
            return interaction.reply(`list error ${e}`)
        }
    }

}
