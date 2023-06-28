const SUPPORTED_PLATFORMS = require('@consts/platforms');
const { prepareDescription, prepareTags } = require('@utils/formatString');

// Raw fields assigning rules live here
module.exports = [
	// YouTube
	{
		validateSource: source => source == SUPPORTED_PLATFORMS.YOUTUBE.toLowerCase(),
		setRawFields: ({ track: { raw: { channel, tags, description, source }, views, duration }, embed }) => {
			embed.setDescription(prepareDescription(description));
			embed.setAuthor({ name: channel.name, iconURL: channel.icon.url, url: channel.url });

			embed.addFields(
				{ name: 'Tags:', value: prepareTags(tags) },
				{ name: 'Views:', value: views.toString(), inline: true },
				{ name: 'Duration:', value: duration.toString(), inline: true },
				{ name: 'Source:', value: source, inline: true }
			);
		}
	},
	// SoundCloud
	{
		validateSource: source => source == SUPPORTED_PLATFORMS.SOUNDCLOUD.toLowerCase(),
		setRawFields: ({ track: { raw: { engine: { author, genre }, description, source }, views, duration }, embed }) => {
			embed.setDescription(prepareDescription(description));
			embed.setAuthor({ name: author.name, iconURL: author.avatarURL, url: author.url });

			if (genre) {
				embed.addFields({ name: 'Genre:', value: genre });
			}

			embed.addFields(
				{ name: 'Views:', value: views.toString(), inline: true },
				{ name: 'Duration:', value: duration.toString(), inline: true },
				{ name: 'Source:', value: source, inline: true }
			);
		}
	},
	// Spotify
	{
		validateSource: source => source == SUPPORTED_PLATFORMS.SPOTIFY.toLowerCase(),
		setRawFields: ({ track: { raw: { author, description, source }, duration }, embed }) => {

			embed.setDescription(prepareDescription(description));
			embed.setAuthor({ name: author });

			embed.addFields(
				{ name: 'Duration:', value: duration.toString(), inline: true },
				{ name: 'Source:', value: source, inline: true }
			);
		}
	},
	// Deezer
	{
		validateSource: (source, url) => source == 'arbitrary' && url.indexOf('https://deezer.com/') == 0,
		setRawFields: ({ track: { raw: { author }, duration }, embed }) => {

			const firstAuthor = author[0];

			embed.setAuthor({ name: firstAuthor.name, iconURL: firstAuthor.image, url: firstAuthor.url });
			embed.addFields(
				{ name: 'Duration:', value: duration.toString(), inline: true },
				{ name: 'Source:', value: SUPPORTED_PLATFORMS.DEEZER.toLowerCase(), inline: true }
			);
		}
	},
	// Reverbnation
	{
		validateSource: source => source == SUPPORTED_PLATFORMS.REVERBNATION.toLowerCase(),
		setRawFields: ({ track: { raw: { duration, views, author, url}, queryType, thumbnail}, embed }) => {

			embed.setAuthor({ name: author, iconURL: thumbnail, url: url });
			embed.addFields(
				{ name: 'Duration:', value: duration.toString(), inline: true },
				{ name: 'Source:', value: queryType, inline: true }
			);
		}
	},
	// Apple Music
	{
		validateSource: source => source == SUPPORTED_PLATFORMS.APPLE_MUSIC.toLowerCase(),
		setRawFields: ({track: {raw: {duration, url, author, source}, thumbnail}, embed}) => {

			embed.setAuthor({name: author, iconURL: thumbnail, url: url});
			embed.addFields(
				{ name: 'Duration:', value:duration.toString(), inline: true},
				{ name: 'Source:', value: source.toString(), inline:true}
				
			)
		}
	},
	// Vimeo
];