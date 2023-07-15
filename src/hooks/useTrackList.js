const TrackList = require('@classes/TrackList');

const useTrackList = (guildId) => {
    return TrackList.GetListString(guildId);
}

module.exports = useTrackList;