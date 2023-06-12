const { SlashCommandBuilder } = require("@discordjs/builders");
const { useHistory } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("goin back a track"),
    async execute({ client, interaction }) {
        const history = useHistory(interaction.guild.id);
        await history.previous();

        await interaction.reply('skip was done !')
    }
}