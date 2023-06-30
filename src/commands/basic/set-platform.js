const usePlatform = require('@hooks/usePlatform');
const [getCurrentPlatforms, getSupportedPlatforms, setPlatform] = usePlatform();
const { SlashCommandBuilder } = require('@discordjs/builders');
const platform_list = getSupportedPlatforms();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-platform')
        .setDescription('What platform you want choose ?')
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('Platform name')
                .setAutocomplete(true)),
    async autocomplete({ interaction }) {
        
        await interaction.respond(
           platform_list.map( title => ({ name: title, value: title }))
        );
    },
    async execute({ interaction }) {
        const platformQuery = interaction.options.getString('platform');

        if (!setPlatform(platformQuery)) {
            return await interaction.reply(`This platform isn't support`)
        }

        await interaction.reply(`The platform ${platformQuery} was seted`);
    }
};