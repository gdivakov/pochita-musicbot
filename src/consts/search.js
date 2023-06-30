const { QueryType } = require('discord-player');

const SEARCH_TYPES =
{
    SPOTIFY: QueryType.SPOTIFY_SEARCH,
    YOUTUBE: QueryType.YOUTUBE_SEARCH,
    SOUNDCLOUD: QueryType.SOUNDCLOUD_SEARCH,
    APPLE_MUSIC: QueryType.APPLE_MUSIC_SEARCH,
}

module.exports = {
    SEARCH_TYPES
};