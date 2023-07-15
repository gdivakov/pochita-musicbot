const { MIN_PREV_TRACKS_TO_SHOW, MAX_NEXT_TRACKS_TO_SHOW } = require('@consts');
const { useQueue } = require('discord-player');
const { prepareSongTitle } = require('@utils/formatString');

const CURRENT_TRACK_NUM = 1;

class TrackList
{
    GetListString(guildId) {
        const list = this.GetList(guildId);
        console.log('list', list);

        const preparedList = list.map(track => {
            if (track.isCurrent)
            {
                return '> ' + prepareSongTitle(track);
            }

            return prepareSongTitle(track);
        }).join('\n\t');

        return preparedList;
    }

    GetList(guildId)
    {
        const queue = useQueue(guildId);

        if(!queue) {
            return [];
        }

        const currentTrack = [queue.currentTrack];
        const prevTracks = queue.history.tracks.data.reverse();
        const nextTracks = queue.tracks.data;

        let trackList = prevTracks.concat(currentTrack);
        const currentTrackIdx = trackList.length - 1;
        trackList = trackList.concat(nextTracks);

        trackList.map((track, idx) => ({ title: track.title, author: track.author, isCurrent: idx === currentTrackIdx }));

        return trackList;
    }
}

module.exports = new TrackList();