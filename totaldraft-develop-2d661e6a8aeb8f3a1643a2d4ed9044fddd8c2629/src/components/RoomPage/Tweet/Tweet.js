import React, { PropTypes, Component } from 'react';
import s from './Tweet.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import moment from 'moment';

class Tweet extends Component {

  static propTypes = {
    tweet: PropTypes.object,
    isTimelineTweet: PropTypes.bool,
    isSearchTweet: PropTypes.bool,
    searchValue: PropTypes.string
  };

  constructor(props) {
    super(props);

    moment.updateLocale('en', {
      relativeTime: {
        future: '%s',
        past: '%s',
        s: '%ds',
        m: '%dm',
        mm: '%dm',
        h: '%dh',
        hh: '%dh',
        d: '%dd',
        dd: '%dd',
        M: '%dm',
        MM: '%dm',
        y: '%dy',
        yy: '%dy'
      }
    });
  }

  getAuthorProfileImage() {
    const { tweet } = this.props;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;
    const imageUrl = isRetweeted ? tweet.retweeted_status.user.profile_image_url : tweet.user.profile_image_url;
    return <div className={s.profileImage} style={{ backgroundImage: `url('${imageUrl}')` }}></div>;
  }

  getAuthorName() {
    const { tweet } = this.props;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;
    const author = isRetweeted ? tweet.retweeted_status.user.name : tweet.user.name;
    return author;
  }

  getRetweetedAuthorName() {
    const { tweet } = this.props;
    return tweet.user.name;
  }

  getLiveText(text) {
    const { tweet } = this.props;

    function getUrl(tag) {
      return `<a target="_blank" href=https://twitter.com/hashtag/${tag}>${tag}</a>`;
    }

    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const urlText = text.replace(urlRegex, '<a target="_blank" href="$1">$1</a>');

    const { hashtags } = tweet.entities;
    const isHashtags = hashtags.length > 0;

    let hashtagText = '';

    if (isHashtags) {
      const newHashtags = hashtags.map(tag => `#${tag.text}`);
      const splitedArray = newHashtags.map((split) => split).join('|');
      const re = new RegExp(`(${splitedArray})`, 'gi');
      const hashtagsRe = new RegExp('https://twitter.com/hashtag/#', 'gi');
      const textWithHashtags = urlText.replace(re, getUrl('$1')).replace(hashtagsRe, 'https://twitter.com/hashtag/');
      hashtagText = textWithHashtags;
    } else {
      hashtagText = urlText;
    }

    const newUrlRegex = /(^|[^@\w])@(\w{1,15})\b/g;
    const usernameText = hashtagText.replace(newUrlRegex, '<a target="_blank" href="http://twitter.com/$2"> @$2 </a>');

    return <div dangerouslySetInnerHTML={{ __html: usernameText.trim() }} />;
  }

  getText() {
    const { tweet, searchValue } = this.props;
    const text = tweet.text;

    const splited = searchValue.split(' ');
    const splitedArray = splited.map((split) => split).join('|');
    const re = new RegExp(`(${splitedArray})`, 'gi');
    const highlitedText = text.replace(re, `<span class="${s.highlight}">$1</span>`);

    return this.getLiveText(highlitedText);
  }

  getDate() {
    const { tweet } = this.props;
    const dateValue = (new Date(tweet.created_at)).toISOString();

    return moment(dateValue).fromNow();
  }

  getImage() {
    const { tweet } = this.props;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;
    const entities = isRetweeted ? tweet.retweeted_status.extended_entities : tweet.extended_entities;
    const isEntieties = entities ? true : false;

    if (isEntieties && entities.media && entities.media.length > 0) {
      const isVideo = entities.media[0].type === 'video' || entities.media[0].type === 'animated_gif';
      if (isVideo) {
        const video = entities.media[0];

        return (
          <video className={s.twitterMediaImage} controls>
            {video.video_info.variants.map(variant => <source key={variant.url} src={variant.url} type={variant.content_type} />)}
          </video>
        );
      }

      const isImage = entities.media[0].type === 'photo';
      if (isImage) {
        return (
          <img className={s.twitterMediaImage} src={entities.media[0].media_url} />
        );
      }
    }
    return false;
  }

  getAuthorScreenName() {
    const { tweet } = this.props;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;
    const author = isRetweeted ? tweet.retweeted_status.user.screen_name : tweet.user.screen_name;
    return `@${author}`;
  }

  getVerifiedIcon() {
    const { tweet } = this.props;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;
    const isVerifed = isRetweeted ? tweet.retweeted_status.user.verified : tweet.user.verified;
    return isVerifed ? <div className={s.verified}></div> : null;
  }

  getTweetHeadInfo() {
    return (
      <div className={s.tweetHeadLeft}>
        {this.getAuthorProfileImage()}
        <div className={s.tweetNames}>
          <div className={s.nameIconContainer}>
            <div className={s.authorName}>{this.getAuthorName()}</div>
            {this.getVerifiedIcon()}
          </div>
          <div className={s.authorScreenName}>{this.getAuthorScreenName()}</div>
        </div>
      </div>
    );
  }

  render() {
    const { isSearchTweet, tweet } = this.props;
    const { text } = tweet;
    const isRetweeted = tweet.retweeted_status === undefined ? false : true;

    return (
      <div className={s.tweetContainer}>
        <div className={s.tweet}>
        <div className={s.timeAgo}>{this.getDate()}</div>
          <div className={s.tweetHead}>
            { isRetweeted ?
              <div className={s.retweetedText}>
                <div className={s.retweetedName}> {this.getRetweetedAuthorName()} Retweeted</div>
                <svg viewBox="0 0 75 72">
                  <path d="M70.676 36.644C70.166 35.636 69.13 35 68 35h-7V19c0-2.21-1.79-4-4-4H34c-2.21 0-4 1.79-4 4s1.79 4 4 4h18c.552 0 .998.446 1 .998V35h-7c-1.13 0-2.165.636-2.676 1.644-.51 1.01-.412 2.22.257 3.13l11 15C55.148 55.545 56.046 56 57 56s1.855-.455 2.42-1.226l11-15c.668-.912.767-2.122.256-3.13zM40 48H22c-.54 0-.97-.427-.992-.96L21 36h7c1.13 0 2.166-.636 2.677-1.644.51-1.01.412-2.22-.257-3.13l-11-15C18.854 15.455 17.956 15 17 15s-1.854.455-2.42 1.226l-11 15c-.667.912-.767 2.122-.255 3.13C3.835 35.365 4.87 36 6 36h7l.012 16.003c.002 2.208 1.792 3.997 4 3.997h22.99c2.208 0 4-1.79 4-4s-1.792-4-4-4z"/>
                </svg>
              </div>
              :
              this.getTweetHeadInfo()
            }
          </div>
          { isRetweeted ?
            <div className={cx(s.tweetHead, s.tweetHeadSpace)}>
              {this.getTweetHeadInfo()}
            </div>
            : null
          }
          {this.getImage()}
          <div className={s.text}>
            { isSearchTweet ?
              this.getText()
              :
              this.getLiveText(text)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Tweet);
