const { QueryType } = require('discord-player');

let platform = 'YOUTUBE_SEARCH';
let platform_list = [];
let SupportedPlatforms_SUCCES = false;
const usePlatform = function () {

    const getSupportedPlatforms = () => {
        platform_types = Object.entries(QueryType);
        if (!SupportedPlatforms_SUCCES) {
            for (const [key, value] of platform_types) {
                const [firstWord, ...rest] = key.split('_');
                if (key.includes('_') && !platform_list.includes(firstWord) && rest.pop() == 'SEARCH') {
                    platform_list.push(firstWord.toLowerCase());
                };
            }
            SupportedPlatforms_SUCCES = true;
        }
        return platform_list
    }
    getSupportedPlatforms();
    
    const getCurrentPlatform = () => platform;

    const setPlatform = (platform_title) => {
        if (!platform_list.includes(platform_title)) return false;
        platform = platform_title.toUpperCase() + '_SEARCH';
        return true
    }
    return [getCurrentPlatform, getSupportedPlatforms, setPlatform];
}

module.exports = usePlatform;