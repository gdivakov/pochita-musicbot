const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("next")
        .setDescription("Next track"),
    async execute({ client, interaction }) {
        try {
            const queue = useQueue(interaction.guild.id);
            queue.node.skip();

            await interaction.reply('Start playing next track')
        } catch(e) {
            return interaction.reply('next error', e)
        }

    }
}