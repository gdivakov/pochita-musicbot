const { SlashCommandBuilder } = require('@discordjs/builders');
const SUPPORTED_PLATFORMS = require('@consts/platforms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-platforms')
		.setDescription('Get a list of supported platforms'),
	async execute({ interaction }) {
		try {
			const supportedPlatforms = '- ' + Object.values(SUPPORTED_PLATFORMS).join('\n- ');

			await interaction.reply(`**Supported platforms:** \n${supportedPlatforms}`);
		} catch (e) {
			return interaction.reply(`list error ${e}`);
		}
	}
};
