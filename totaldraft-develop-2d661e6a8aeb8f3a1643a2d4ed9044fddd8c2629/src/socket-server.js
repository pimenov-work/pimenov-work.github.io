import io from 'socket.io';
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';
import Tweets from './tweets-schema';
import { TWITTER_API_KEY, TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } from './config';

const Twit = require('twit');

const TwitterApi = new Twit({
  consumer_key: TWITTER_API_KEY,
  consumer_secret: TWITTER_API_SECRET,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

function getSortedTweetsByPosition(sortByArray, currentArray) {
  const sortedTweets = [];
  let helper = [];

  sortByArray.forEach((key) => {
    let found = false;
    helper = currentArray.filter((item) => {
      if (!found && item.name === key) {
        sortedTweets.push(item);
        found = true;
        return false;
      }
      return true;
    });
  });
  return sortedTweets;
}
let stream = null;

function startStream(twitterSocket, socket, tournament_id, itemArray) {
  Tweets.find({}, (err, res) => {
    if (res && res.length > 0) {
      if (socket) {
        let filteredTweets = res.filter(tweet => tweet.tournament_id === tournament_id);
        const sortedTweets = getSortedTweetsByPosition(itemArray, filteredTweets);
        const resources = sortedTweets.map(tweet => {
          return { resource: tweet.name, type: tweet.type, arrayOfTweets: tweet.feed.slice(0, 20) };
        });
        socket.emit('resources', resources);
      }

      let streams = '';
      const tweetsNameId = [];

      res.forEach(tweet => {
        const { type, twitter_id, name } = tweet;

        if (type === 'statuses/user_timeline') {
          streams += streams.length > 0 ? `, ${twitter_id}` : `${twitter_id}`;
          tweetsNameId.push({ twitter_id, name });
        }
      });

      if (stream) stream.destroy();
      stream = TwitterApi.stream('statuses/filter', { 'follow': streams });

      stream.on('tweet', (tweet) => {
        const searchValue = tweetsNameId.filter(obj => obj.twitter_id === tweet.user.id_str)[0];
        const isExist = searchValue ? true : false;
        if (isExist) {
          const name = searchValue.name;

          Tweets.findOneAndUpdate({ name }, { $push: { feed: { $each: [tweet], $position: 0 } } }, (error) => {
            if (error) console.log(error);
          });
          twitterSocket.emit('newtweet', { name, tweet });
        }
      });
    }
  });
}

function insertTwitterFeeds(data, twitterSocket, socket) {
  const { tournament_id, tournament_feed } = data;
  const searchQuery = {
    count: 20
  };
  const promises = [];
  const itemArray = [];

  tournament_feed.forEach((name) => {
    itemArray.push(name);
    const isUser = name.charAt(0) === '@';
    const searchType = isUser ? 'statuses/user_timeline' : '';

    if (isUser) {
      const mongoQuery = {
        name,
        type: searchType,
        tournament_id
      };

      searchQuery.screen_name = name;
      mongoQuery.feed = sortBy(mongoQuery.feed, tweet => Date.parse(tweet.created_at));

      promises.push(
        new Promise((resolve, reject) =>
          TwitterApi.get(searchType, searchQuery, (err, res) => {
            if (!err && res) {
              mongoQuery.feed = res;
              mongoQuery.twitter_id = res[0].user.id_str;
              const model = new Tweets(mongoQuery);
              model.save();
            }
            resolve();
          })
        )
      );
    }
  });
  Promise.all(promises).then(() => {
    startStream(twitterSocket, socket, tournament_id, itemArray);
  });
}

export default function (server) {
  const allowedOrigins = '*:*';
  const socketServer = io(server, { origins: allowedOrigins });
  const twitterSocket = socketServer.of('/twitter');

  startStream(twitterSocket);
  twitterSocket.on('connection', (socket) => {
    socket.on('resources', (data) => {
      const { tournament_id, tournament_feed } = data;

      Tweets.find({ tournament_id }, (err, tweets) => {
        if (err) return console.log(err);
        if (!tweets || tweets.length === 0) {
          insertTwitterFeeds(data, twitterSocket, socket);
        } else if (tweets && tweets.length > 0) {
          const itemArray = [];

          tournament_feed.forEach((name) => {
            itemArray.push(name);
          });
          const sortedTweets = getSortedTweetsByPosition(itemArray, tweets);
          const resources = sortedTweets.map(tweet => {
            return { resource: tweet.name, type: tweet.type, arrayOfTweets: tweet.feed.slice(0, 20) };
          });
          socket.emit('resources', resources);
        }
      });
    });
    socket.on('resourcesLoading', ({ name, previousCount, countOfShow }) => {
      Tweets.findOne({ name }, (err, tweet) => {
        if (err) return console.log(err);
        if (tweet) {
          const resources = {
            resource: tweet.name,
            count: tweet.feed.length,
            arrayOfTweets: tweet.feed.slice(previousCount, countOfShow)
          };
          socket.emit('resourcesLoading', resources);
        }
      });
    });
  });
}
