const { TRACK_TITLE_MAX_LENGTH, TRACK_AUTHOR_MAX_LENGTH, TRACK_DESCRIPTION_MAX_LENGTH, TRACK_TAGS_MAX } = require('@consts');

const prepareSongTitle = ({ title, author }) => {
	return prepareTitle(title, TRACK_TITLE_MAX_LENGTH) + ' — ' + '**' + prepareTitle(author, TRACK_AUTHOR_MAX_LENGTH) + '**';
};

const prepareTitle = (title, maxLength) => {
	let preparedTitle = capitalizeWords(title.toLowerCase())
		.slice(0, maxLength);

	// Find the index of the last space
	const lastSpaceIndex = preparedTitle.lastIndexOf(' ');

	// Slice the string before the last space
	preparedTitle = preparedTitle.slice(0, lastSpaceIndex);

	return preparedTitle;
};

const prepareDescription = (desc) => {
	if (!desc.length) {
		return ' ';
	}

	let preparedDesc = desc.length > TRACK_DESCRIPTION_MAX_LENGTH ? desc.slice(0, TRACK_DESCRIPTION_MAX_LENGTH) : desc;

	// Find the index of the last \n
	const newLineLastIndex = preparedDesc.lastIndexOf('\n');

	// Slice the string before the last \n
	preparedDesc = preparedDesc.slice(0, newLineLastIndex);

	return preparedDesc;
};

const prepareTags = (tags) => {
	if (!tags.length) {
		return 'no tags';
	}

	return tags.slice(0, TRACK_TAGS_MAX).map(tag => `#${tag.replaceAll(' ', '_')}`).join(' ');
};

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const capitalizeWords = (str) => {
	// Split the string into an array of words
	const words = str.split(' ');

	// Capitalize the first letter of each word
	const capitalizedWords = words.map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	// Join the capitalized words back into a string
	const capitalizedStr = capitalizedWords.join(' ');

	return capitalizedStr;
};

module.exports = { prepareSongTitle, prepareDescription, prepareTags };