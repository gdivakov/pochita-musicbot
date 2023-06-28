const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const useDatabase = require('@hooks/useDatabase');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-playlist')
        .setDescription('List all playlist'),
    async execute({ client, interaction }) {
        const db = useDatabase();
        let playlist = Object.values(await db.getPlaylists());
        let list = playlist.map(({ title }) => title).join('\n');

        await interaction.reply(list);
    },
};
