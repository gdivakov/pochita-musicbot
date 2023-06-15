const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("next")
        .setDescription("Next track"),
    async execute({ client, interaction }) {
        try {
            const queue = useQueue(interaction.guild.id);

            if(!queue || !queue.tracks.data.length) {
                await interaction.reply("There are no next tracks in the queue")
                return;
            }

            queue.node.skip();
            await interaction.reply('Start playing next track')
        } catch(e) {
            return interaction.reply('next error', e)
        }

    }
}