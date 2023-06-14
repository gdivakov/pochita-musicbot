const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue, useHistory } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Get a list of songs from the current queue"),
    async execute({ client, interaction }) {
        try {
            let displayedQueue = '';
            const queue = useQueue(interaction.guild.id);
            console.log('history:           ', queue.history)
            const trackList = queue.tracks.toArray().forEach((track, index) => {
                if(track.id == queue.currentTrack.id) {
                
                queue.tracks.slice(index - 5, 10).map(e => displayedQueue += `[${index}] ${e.title}`)
                }
            });
            
            await interaction.reply(` Queue list : ${trackList ? displayedQueue : "nothin in queue"}`)
        } catch(e) {
            return interaction.reply(`list error ${e}`)
        }
    }

}
