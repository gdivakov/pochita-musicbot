const { SlashCommandBuilder } = require('discord.js');
const useDatabase = require('@hooks/useDatabase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-playlist')
        .setDescription('Delete playlist')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Select playlist by delete')
                .setAutocomplete(true)),
    async autocomplete({ interaction }) {
        const focusedValue = interaction.options.getFocused();
        const db = useDatabase();

        const choices = await db.getPlaylists();
        const filtered = choices.filter(choice => choice.title.startsWith(focusedValue));

        await interaction.respond(
            filtered.map(({ title }) => ({ name: title, value: title })),
        );
    },
    async execute({ interaction }) {
        const db = useDatabase();
        const playlistTitle = interaction.options.getString('title', true);
        const { status, errorMessage } = await db.deletePlaylist(playlistTitle);

        if (!status) {
            return await interaction.reply(errorMessage);
        }

        await interaction.reply('Playlist was deleted');
    },
};
