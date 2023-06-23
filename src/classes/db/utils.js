const { ERROR_MESSAGE } = require('@consts/message');

// DB handled error
class DBError extends Error {
	constructor(message, code) {
		super(message);
		this.name = 'DBError';
		this.code = code;
	}
}

const databaseProxyHandler = {
	get: function (target, prop) {
		// Intercept function calls
		if (typeof target[prop] !== 'function') {
			target[prop];
		}

		const originalFunction = target[prop];

		return async function (...args) {
			let response = null;

			try {
				response = await originalFunction.apply(target, args);
			} catch (error) {
				return { status: false, errorMessage: ERROR_MESSAGE.COMMAND.DEFAULT_MESSAGE };
			}

			// No error or error was handled
			return response ? response : { status: true, errorMessage: null };
		};
	},
};


module.exports = {
	databaseProxyHandler,
	DBError
};

// } catch (error) {
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.title) {
//         return { status: false, errorMessage: ERROR_MESSAGE.PLAYLIST.CREATE.UNIQUE_TITLE };
//     }

//     return { status: false, errorMessage: ERROR_MESSAGE.COMMAND.DEFAULT_MESSAGE };
// }

return { status: true, errorMessage: null };