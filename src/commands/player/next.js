const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("next")
        .setDescription("skip"),
    async execute({ client, interaction }) {
        const queue = useQueue(interaction.guild.id);
        queue.node.skip();

        await interaction.reply('skip was done !')
    }
}