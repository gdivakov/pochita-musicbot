const { EmbedBuilder } = require('discord.js');
const { prepareSongTitle, prepareDescription, prepareTags } = require('@utils/formatString');

//Todo: Finalize preview for other sources and refactor setFields Source() to match the open-closed principle
// Set custom embed fields
class PochitaEmbed extends EmbedBuilder {
  constructor(track, ...rest) {
    super(...rest);

    this.track = track;
  }

  prepareSongStartedEmbed() {
    const { track } = this;
    console.log('---------track', track);

    this.setTitle(prepareSongTitle(track));
    this.setURL(track.url);
    this.setColor(0x0099FF)
    this.setFieldsBySource(track.raw.source);

    console.log('track.thumbnail', track.thumbnail);
    this.setImage(track.thumbnail);
    // this.setTimestamp();
    // this.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    return this;
  }

  setFieldsBySource(source) {
    switch (source) {

      case 'youtube':
        const { raw: { channel, tags, description }, raw, views, duration } = this.track;
        this.setDescription(prepareDescription(description));
        this.setAuthor({ name: channel.name, iconURL: channel.icon.url, url: channel.url });

        this.addFields(
          { name: 'Tags:', value: prepareTags(tags) },
          { name: 'Views:', value: views.toString(), inline: true },
          { name: 'Duration:', value: duration.toString(), inline: true },
          { name: 'Source:', value: source, inline: true }
        );
        break;

      case 'soundcloud':
        console.log(this.track.raw.engine.author);
        const SkAuthor = this.track.raw.engine.author;

        this.setDescription(prepareDescription(this.track.raw.description));
        this.setAuthor({ name: SkAuthor.name, iconURL: SkAuthor.avatarURL, url: SkAuthor.url });

        if (this.track.raw.engine.genre)
        {
          this.addFields({ name: 'Genre:', value: this.track.raw.engine.genre });
        }

        this.addFields(
          { name: 'Views:', value: this.track.views.toString(), inline: true },
          { name: 'Duration:', value: this.track.duration.toString(), inline: true },
          { name: 'Source:', value: source, inline: true }
        );
        break;

      case 'spotify':
        const { raw: { author } } = this.track;

        this.setDescription(prepareDescription(this.track.raw.description));
        this.setAuthor({ name: author });

        this.addFields(
          { name: 'Duration:', value: this.track.duration.toString(), inline: true },
          { name: 'Source:', value: source, inline: true }
        );

        break;
    }
  }
}

module.exports = PochitaEmbed;