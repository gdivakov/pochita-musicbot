const { SlashCommandBuilder } = require("@discordjs/builders");
const { useHistory } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("Previous track"),
    async execute({ client, interaction }) {
        const history = useHistory(interaction.guild.id);
        await history.previous();

        await interaction.reply('Start playing previous track !')
    }
}