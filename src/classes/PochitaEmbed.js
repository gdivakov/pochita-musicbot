const { EmbedBuilder } = require('discord.js');
const { prepareSongTitle } = require('@utils/formatString');
const RF_ASSIGNING_RULES = require('@classes/RFAssigningRules');

class PochitaEmbed extends EmbedBuilder {
	constructor(track, ...rest) {
		super(...rest);

		this.track = track;
	}

	prepareSongStartedEmbed() {
		const { track } = this;

		// Common fields
		this.setTitle(prepareSongTitle(track));
		this.setURL(track.url);
		this.setColor(0x0099FF)

		// Raw fields (source specific)
		this.setFieldsBySource(track.raw.source);
		this.setImage(track.thumbnail);

		return this;
	}

	setFieldsBySource(source) {
		const matchingRule = RF_ASSIGNING_RULES.find(rule => rule.validateSource(source, this.track.url));

		if (matchingRule) {
			matchingRule.setRawFields({ track: this.track, embed: this });
		}
	}
}

module.exports = PochitaEmbed;