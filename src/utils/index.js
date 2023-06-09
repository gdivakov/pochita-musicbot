const fs = require('node:fs');
const path = require('node:path');

const applyToEachCommand = (callback) => {
	// eslint-disable-next-line no-undef
	const foldersPath = path.join(__dirname, '../commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			if (validateCommand(command, filePath)) {
				callback(command);
			}
		}
	}
};

const validateCommand = (command, filePath) => {
	if ('data' in command && 'execute' in command) {
		return true;
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		return false;
	}
};

module.exports = { applyToEachCommand };