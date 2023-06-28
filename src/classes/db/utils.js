const { ERROR_MESSAGE } = require('@consts/message');
const mongoose = require('mongoose');

// Handle unhandled errors and return response
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
				console.log('unexpected error while working w/ db: ', error);
				return { status: false, errorMessage: ERROR_MESSAGE.COMMAND.DEFAULT_MESSAGE };
			}

			// No error or error was handled
			return response ? response : { status: true, errorMessage: null };
		};
	},
};

const initDBErrorHandler = () => {
	mongoose.connection.on('error', (error) => {
		console.error('Error while connecting to MongoDB:', error);
		mongoose.connection.close();
	});

	process.on('uncaughtException', (error) => {
		console.error('uncaughtException:', error);
		mongoose.connection.close(() => {
			process.exit(1);
		});
	});

	process.on('exit', () => {
		mongoose.connection.close();
	});
}

module.exports = {
	databaseProxyHandler,
	initDBErrorHandler,
};