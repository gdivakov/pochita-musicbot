const ERROR_MESSAGE = {
	COMMAND: {
		DEFAULT_MESSAGE: 'Error while executing this command :(',
	},
	PLAYLIST: {
		CREATE: {
			UNIQUE_TITLE: 'Title must be unique'
		},
		DELETE: {
			TRACK_NOT_FOUND: 'Track is not found in the playlist'
		}
	}
};

module.exports = {
	ERROR_MESSAGE,

};