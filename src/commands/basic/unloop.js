const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unloop")
        .setDescription("Unloop current track"),
    async execute({ client, interaction }) {
        try {
            const queue = useQueue(interaction.guild.id);
            queue.setRepeatMode(0);

            await interaction.reply('Track was unlooped')
        } catch (e) {
            return interaction.reply("Unloop error", e)
        }

    }
}