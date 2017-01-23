import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import tournamentsModule from 'modules/tournaments';
import authModule from 'modules/auth';
import teamsModule from 'modules/teams';
import playersModule from 'modules/players';
import intlModule from 'modules/intl';
import s from './MyGames.css';
import FutureGames from '../FutureGames';
import LiveGames from '../LiveGames';
import PastGames from '../PastGames';
import MyGamesNavigation from '../MyGamesNavigation';
import GamesStats from '../GamesStats';
import { getAllState } from '../../selectors';
import messages from './messages';

class MyGames extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    tournaments: PropTypes.array.isRequired,
    mygames: PropTypes.object.isRequired,
    prizes: PropTypes.array,
    userStats: PropTypes.object,
    page: PropTypes.string.isRequired,
    players: PropTypes.array,
    teams: PropTypes.array,
    intl: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch, intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));

    dispatch(tournamentsModule.actions.fetchTournaments());
  }

  render() {
    const { userStats, mygames, prizes, page, tournaments,
      players, teams, currentLocale } = this.props;

    return (
      <div className={s.root}>
        <header className={s.header}>
          <MyGamesNavigation
            status={page}
            mygames={mygames}
            prizes={prizes}
          />
          <GamesStats stats={userStats} />
        </header>
        <div className={s.games}>
          {page === 'future' ?
            <FutureGames
              rooms={mygames.future.rooms}
              bids={mygames.future.bids}
              players={players}
              teams={teams}
              tournaments={tournaments}
              currentLocale={currentLocale}
            />
          : null}
          {page === 'live' ?
            <LiveGames
              rooms={mygames.live.rooms}
              bids={mygames.live.bids}
              tournaments={tournaments}
              currentLocale={currentLocale}
            />
          : null}
          {page === 'past' ?
            <PastGames
              rooms={mygames.past.rooms}
              bids={mygames.past.bids}
              tournaments={tournaments}
              prizes={prizes}
              currentLocale={currentLocale}
            />
          : null}
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    mygames: getAllState,
    tournaments: tournamentsModule.selectors.getTournaments,
    prizes: authModule.selectors.getUserPrizes,
    userStats: authModule.selectors.getUserStats,
    teams: teamsModule.selectors.getTeams,
    players: playersModule.selectors.getPlayers,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(MyGames)));
