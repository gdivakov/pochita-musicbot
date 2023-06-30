const usePlatform = require('@hooks/usePlatform');
const [ , setPlatform ] = usePlatform();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { SEARCH_TYPES } = require('@consts/search')
const SUPPORTED_PLATFORMS = require('@consts/platforms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-platform')
        .setDescription('Select platform you want to choose for searching')
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('Platform name')
                .setAutocomplete(true)),
    async autocomplete({ interaction }) {

        const options = Object.entries(SEARCH_TYPES).map(([key, value]) => ({ value, name: SUPPORTED_PLATFORMS[key] }));

        await interaction.respond(options);
    },
    async execute({ interaction }) {
        const platform = interaction.options.getString('platform');

        if (!Object.values(SEARCH_TYPES).includes(platform))
        {
            return await interaction.reply(`Platform isn't supported`);
        }

        setPlatform(platform)

        await interaction.reply(`Search platform changed`);
    }
};