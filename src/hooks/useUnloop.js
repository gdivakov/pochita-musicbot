const { useQueue } = require('discord-player');

const useUnloop = (guildId) => {
    let queue = useQueue(guildId);

    if (queue && queue.repeatMode) {
		queue.setRepeatMode(0);
    }
}

module.exports = useUnloop;
