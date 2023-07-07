const { MIN_PREV_TRACKS_TO_SHOW, MAX_NEXT_TRACKS_TO_SHOW } = require('@consts');
let listState = {
    MIN_PREV_TRACKS: MIN_PREV_TRACKS_TO_SHOW,
    MAX_NEXT_TRACKS: MAX_NEXT_TRACKS_TO_SHOW,
}

const useList = (queue) => {

    const listEnd = queue.tracks.data.slice(0, MAX_NEXT_TRACKS_TO_SHOW).length;

    const handleNext = () => {
        if( listEnd < 6) {
            listState.MIN_PREV_TRACKS -= 1
        } else {
            listState.MIN_PREV_TRACKS = MIN_PREV_TRACKS_TO_SHOW
        } 
    }

    const handlePrev = () => {
        if( listEnd < 6) {
            listState.MIN_PREV_TRACKS += 1
        } else {
            listState.MIN_PREV_TRACKS = MIN_PREV_TRACKS_TO_SHOW
        }
    }

    return [listState, handlePrev, handleNext];
}

module.exports = useList;