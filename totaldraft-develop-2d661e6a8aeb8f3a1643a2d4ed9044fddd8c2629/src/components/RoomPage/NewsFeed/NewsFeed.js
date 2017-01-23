import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './NewsFeed.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import io from 'socket.io-client';
import Tweet from '../Tweet';
import { statsApiUrl, GAME_STATUS_FREEZE } from '../../../config';

class NewsFeed extends Component {

  static propTypes = {
    tournament: PropTypes.object,
    onTeamBuilder: PropTypes.bool,
    room: PropTypes.object,
    teams: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      timeline: [],
      isFound: false,
      isResponseCame: false,
      isSearching: false,
      isError: false,
      activeTwitterResource: '',
      twitterResources: [],
      delta: 0,
      isLoadingBlocked: false
    };
    this.onWheel = this.onWheel.bind(this);
  }

  componentWillMount() {
    const { tournament } = this.props;
    const socketPath = 'http://178.63.0.12/twitter';
    this.socket = io(socketPath);
    this.socket.emit('resources', { tournament_id: tournament.tournament_id, tournament_feed: tournament.feed });
    this.socket.on('resources', data => {
      this.setState({ twitterResources: data, activeTwitterResource: data[0].resource, timeline: data[0].arrayOfTweets });
    });

    this.socket.on('resourcesLoading', data => {
      const { resource, arrayOfTweets, count } = data;
      const { activeTwitterResource, timeline } = this.state;

      if (activeTwitterResource === resource) {
        arrayOfTweets.map(tweet => timeline.push(tweet));
        this.setState({ timeline, isLoadingBlocked: count === timeline.length });
      }
    });

    this.socket.on('newtweet', data => {
      const { name, tweet } = data;
      const { activeTwitterResource, timeline } = this.state;

      if (activeTwitterResource === name) {
        timeline.unshift(tweet);
        this.setState({ timeline });
      }
    });
  }

  onWheel() {
    const { activeTwitterResource, timeline, isLoadingBlocked } = this.state;
    if (isLoadingBlocked) return null;

    if (this.refs.scroll.scrollHeight - this.refs.scroll.scrollTop === this.refs.scroll.clientHeight) {
      this.setState({ isLoadingBlocked: true });
      this.socket.emit('resourcesLoading', { name: activeTwitterResource, previousCount: timeline.length, countOfShow: timeline.length + 10 });
    }
  }

  getTimeline() {
    const { timeline, searchValue } = this.state;
    return timeline.map((tweet, i) => <Tweet key={i} tweet={tweet} isTimelineTweet isSearchTweet={false} searchValue={searchValue} />);
  }

  setActiveResource(name) {
    const { twitterResources } = this.state;
    let timeline = [];
    twitterResources.forEach(tweet => {
      if (tweet.resource === name) timeline = tweet.arrayOfTweets;
    });
    this.setState({ isLoadingBlocked: false, activeTwitterResource: name, timeline });
  }

  getTwitterResources() {
    const { twitterResources, activeTwitterResource } = this.state;

    return twitterResources.map((data, i) => {
      const { resource, type } = data;
      const isUserAccount = type === 'statuses/user_timeline';

      return (
        <div className={s.actionElementContainer} key={i}>
          { isUserAccount ?
            <div className={s.newsOwner} onClick={() => this.setActiveResource(resource)}>
              <div className={cx(s.ownerName, s.actionElement, { [s.active]: activeTwitterResource === resource })}>{resource}</div>
              <div className={cx({ [s.verified]: activeTwitterResource === resource })}></div>
            </div>
            : null
          }
        </div>
      );
    });
  }

  getTeambyId(id) {
    const { teams } = this.props;
    return teams.find(t => t.team_id === id);
  }

  getMatches() {
    const { room } = this.props;
    if (room.status !== GAME_STATUS_FREEZE) return null;
    return room.matches.map(match => {
      const { time_start, team1, team2 } = match;
      const team1Data = this.getTeambyId(team1);
      const team2Data = this.getTeambyId(team2);
      const timeEnd = new Date(time_start);
      const timeStart = new Date(time_start);
      timeEnd.setMinutes(timeEnd.getMinutes() + 105)

      if (new Date() >= timeStart && new Date() <= timeEnd) {
        return (
          <div className={s.playingMatchesContainer} key={match.match_id}>
            <div className={s.playingMatches}>
              <div className={s.teamName}>
                {team1Data ? team1Data.title : '-'}
              </div>
              <div className={s.teamLogo} style={{ backgroundImage: `url('${statsApiUrl}${team1Data ? team1Data.logo : ''}')` }}></div>
              <div className={s.matchTime}>vs</div>
              <div className={s.teamLogo} style={{ backgroundImage: `url('${statsApiUrl}${team2Data ? team2Data.logo : ''}')` }}></div>
              <div className={s.teamName}>
                {team2Data ? team2Data.title : '-'}
              </div>
            </div>
          </div>
        );
      }
    });
  }

  render() {
    const { onTeamBuilder, tournament } = this.props;

    return (
      <div className={cx(s.root, { [s.onTeamBuilder]: onTeamBuilder })}>
        <header className={s.header}>
          <div className={s.headerActions}>
            {this.getTwitterResources()}
          </div>
        </header>
        <div className={s.background} ref="scroll" onScroll={() => this.onWheel()}>
          <div className={s.playingMatchesContainer} >
            {this.getMatches()}
          </div>
          <div className={s.tweetsContainer} ref="feed" >
            {this.getTimeline()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  room: state.room.data,
  teams: state.teams.items
});

export default withStyles(s)(connect(mapStateToProps)(NewsFeed));
