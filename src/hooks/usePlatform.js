const { SEARCH_TYPES } = require('@consts/search');

let SELECTED_PLATFORM = SEARCH_TYPES.YOUTUBE;

const getCurrentPlatform = () => SELECTED_PLATFORM;

const setPlatform = platform => {
    SELECTED_PLATFORM = platform;
}

const usePlatform = function () {
    return [getCurrentPlatform, setPlatform];
}

module.exports = usePlatform;