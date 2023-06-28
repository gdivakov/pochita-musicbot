const { SlashCommandBuilder } = require('discord.js');
const useDatabase = require('@hooks/useDatabase');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete track from the playlist')
        .addStringOption(option =>
            option.setName('from-playlist')
                .setDescription('Select playlist to delete from')
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
        const playlistTitle = interaction.options.getString('from-playlist', true);
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.currentTrack)
        {
            return await interaction.reply('No track is playing right now');
        }

        const { status, errorMessage } = await db.deleteFromPlaylist(queue.currentTrack, playlistTitle);

        if (!status) {
            return await interaction.reply(errorMessage);
        }

        await interaction.reply('Track was deleted from the playlist');
    },
};
