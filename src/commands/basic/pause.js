const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause a track"),
    async execute({ client, interaction }) {
        try {
            const queue = useQueue(interaction.guild.id);

            if (!queue) {
                await interaction.reply('There is no track playing');
                return;
            };

            queue.node.setPaused(true);
            await interaction.reply("Track was paused");
        } catch (e) {
            interaction.reply("pause error ", e)
        }

    }
}