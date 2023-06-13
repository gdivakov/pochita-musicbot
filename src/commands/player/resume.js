const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume a track"),
    async execute({ client, interaction }) {
        const queue = useQueue(interaction.guild.id);
        queue.node.setPaused(false);

        await interaction.reply("Track was resumed");
    }
}