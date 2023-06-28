const DISCORD_MESSAGE_LIMIT = 2000;
const LIMIT_EXCEEDED_MESSAGE = '\n....Check the console to get more info....';

const getErrorMessage = (errorStack) => {
    if (!errorStack)
    {
        return 'Error: check the console to get more info';
    }

    if (errorStack.length > DISCORD_MESSAGE_LIMIT)
    {
        return errorStack.slice(0, DISCORD_MESSAGE_LIMIT - LIMIT_EXCEEDED_MESSAGE.length) + LIMIT_EXCEEDED_MESSAGE;
    }

    return errorStack;
}

module.exports = { getErrorMessage };