const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause a track"),
    async execute({ client, interaction }) {
        const queue = useQueue(interaction.guild.id);
        queue.node.setPaused(true);

        await interaction.reply("Track was paused");
    }
}