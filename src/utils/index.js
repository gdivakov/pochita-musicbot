const fs = require('node:fs');
const path = require('node:path');
const { TRACK_TITLE_MAX_LENGTH, TRACK_AUTHOR_MAX_LENGTH } = require('@consts');

const applyToEachCommand = (callback) => {
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
}

const validateCommand = (command, filePath) => {
  if ('data' in command && 'execute' in command) {
    return true;
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    return false;
  }
}

// Todo: move to utils/string
const prepareSongTitle = ({ title, author }) =>
{
  return prepareTitle(title, TRACK_TITLE_MAX_LENGTH) + " — " + '**' + prepareTitle(author, TRACK_AUTHOR_MAX_LENGTH) + '**';
}

const prepareTitle = (title, maxLength) => {
  let preparedTitle = capitalizeWords(title.toLowerCase())
  .slice(0, maxLength)

  if (title.length > maxLength)
  {
    preparedTitle += '...';
  }

  return preparedTitle;
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalizeWords = (str) => {
  // Split the string into an array of words
  const words = str.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a string
  const capitalizedStr = capitalizedWords.join(" ");

  return capitalizedStr;
}

// Main

// song image
// song title - song title
// song views: track.views
// song duration: track.duration

// Custom fields

// YouTube:
// - authorImageURL: raw.channel.icon.url, raw.channel.name, raw.channel.url
// - description: raw.description
// - tags: { '#tag1', '#tag2', '#tag3', '#tag4' }

// SoundCloud:
// - authorImageURL: raw.engine.author.avatarURL, raw.engine.author.avatarURL.username, raw.engine.author.avatarURL.url
// - description: raw.description


module.exports = { applyToEachCommand, prepareSongTitle };