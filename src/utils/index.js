const fs = require('node:fs');
const path = require('node:path');

asdfasdfa
}

const validateCommand = (command, filePath) =>
{
  if ('data' in command && 'execute' in command) {
    return true;
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    return false;
  }
}

module.exports = { applyToEachCommand };