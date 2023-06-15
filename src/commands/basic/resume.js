const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume a track"),
    async execute({ client, interaction }) {
        try {
            const queue = useQueue(interaction.guild.id);

            if(!queue) {
                await interaction.reply('There is no track playing');
                return;
            };
            
            queue.node.setPaused(false);
            await interaction.reply("Track was resumed!");

        } catch (e) {
            return interaction.reply("Resume error: ", e)
        }
    }
}