const { SlashCommandBuilder } = require("@discordjs/builders");
const { useHistory } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("Previous track"),
    async execute({ client, interaction }) {
        try {
            const history = useHistory(interaction.guild.id);
            await history.previous();

            await interaction.reply('Start playing previous track !')
        } catch (e) {
            interaction.reply("previous error ", e)
        }
    }
}