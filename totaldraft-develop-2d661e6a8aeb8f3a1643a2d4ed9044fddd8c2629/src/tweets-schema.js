import mongoose from 'mongoose';

const db = mongoose.connect('mongodb://localhost:27017/totaldraft');

const tweetSchema = new db.Schema({
  feed: mongoose.Schema.Types.Mixed,
  tournament_id: Number,
  name: String,
  type: String,
  twitter_id: String
});

const Tweets = mongoose.model('Tweets', tweetSchema);

export default Tweets;
