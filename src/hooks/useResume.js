const { useQueue } = require('discord-player');

const useResume = (guildId) => {
    let queue = useQueue(guildId);

    if (queue && queue.node.isPaused()) {

		queue.node.setPaused(false);
    }
}

module.exports = useResume;

