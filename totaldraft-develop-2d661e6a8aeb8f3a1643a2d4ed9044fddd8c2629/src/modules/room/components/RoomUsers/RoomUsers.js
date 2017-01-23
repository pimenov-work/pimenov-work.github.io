import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import s from './RoomUsers.css';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SearchBlock from 'components/SearchBlock';
import RoomWinner from '../RoomWinner';
import Bid from './Bid';
import UserTeamDetails from '../UserTeamDetails';
import PlayerInfo from 'components/PlayerInfo';
import { getCurrencySymbol, getCookie, getApplicationMessage } from 'utils';
import { APP_MESSAGES } from 'config';
import { ROOM_STATUS_NEW, ROOM_STATUS_FREEZE, ROOM_STATUS_FINISHED } from '../../constants';
import { getRoomData, filterRoomMembersSelector, getRoomStats, getRoomSingleBidInfo } from '../../selectors';
import { filterRoomBids, getSingleBid } from '../../actions';
import authModule from 'modules/auth';
import teamsModule from 'modules/teams';
import playersModule from 'modules/players';
import appstateModule from 'modules/appstate';
import myteamModule from 'modules/myteam';
import intlModule from 'modules/intl';
import messages from './messages';

class RoomUsers extends Component {

  static propTypes = {
    room: PropTypes.object,
    user: PropTypes.object,
    bids: PropTypes.array,
    teams: PropTypes.array,
    players: PropTypes.array,
    stats: PropTypes.object,
    dispatch: PropTypes.func,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isSearchActive: false,
      isUserBidShown: false,
      isUserTeamPlayerStatsShown: false,
    };
  }

  closeUserBidPanel() {
    this.setState({ isUserBidShown: false })
  }

  closePlayerStats() {
    this.setState({ isUserTeamPlayerStatsShown: false })
  }

  getBidInfo(bidId, bidOwnerId) {
    const { user, room, dispatch } = this.props;
    const token = getCookie('access_token');
    if ((user && bidOwnerId === user.user_id) ||
        (room.status !== ROOM_STATUS_NEW)) {
      dispatch(getSingleBid(room.room_id, bidId, token)).then(res => {
        if (!res.error) {
          this.setState({ isUserBidShown: true });
        }
      });
    } else {
      const msg = getApplicationMessage(APP_MESSAGES.VIEWING_BID_DENIED);
      dispatch(appstateModule.actions.showGlobalNotification(msg));
    }
  }

  openComparePlayerStats(playerId) {
    const { dispatch, room } = this.props;
    const tournamentId = room.tournaments[0];

    dispatch(myteamModule.actions.fetchComparePlayerStats(tournamentId, playerId)).then(response => {
      if (!response.error && response.data.aggr) {
        setTimeout(() => {
          this.setState({ isUserTeamPlayerStatsShown: true });
        }, 100);
      }
    });
  }

  render() {
    const { dispatch, bids, room, user, currentLocale } = this.props;

    const locale = currentLocale.substring(0, 2);
    let mainBackground = { backgroundImage: `url('/images/get_ready_${locale}.svg')` };
    if (room.status === ROOM_STATUS_FINISHED) {
      mainBackground = {
        backgroundImage: `url('/images/game_finished_${locale}.svg')`
      };
    }

    return (
      <section className={cx(s.root, { [s.isActive]: room && room.status === ROOM_STATUS_NEW, [s.isInactive]: room && room.status === ROOM_STATUS_FREEZE })}>
        <header className={s.header}>
          <div className={s.headerTitle}>
            <SearchBlock handleSearchChange={(value) => dispatch(filterRoomBids(value))} />
            <div className={s.headerTitleText}>
              <FormattedMessage {...messages.title} />
              <span className={s.headerCounter}>{bids ? bids.length : ''}</span>
            </div>
          </div>
          <div className={s.tableHeader}>
            <div className={s.tableHeaderPlace}>{room && room.status !== ROOM_STATUS_NEW ? <FormattedMessage {...messages.placeLabel} /> : '#'}</div>
            <div className={s.tableHeaderUser}><FormattedMessage {...messages.tableUser} /></div>
            <div className={s.tableHeaderTeam}><FormattedMessage {...messages.tableTeam} /></div>
            <div className={s.tableHeaderCounts}><FormattedMessage {...messages.tablePoints} /></div>
            <div className={s.tableHeaderPrize}><FormattedMessage {...messages.tablePrize} /></div>
          </div>
        </header>
        <div className={s.table}>
          {(bids && bids.length > 0) && room.status === ROOM_STATUS_FINISHED ?
            <RoomWinner
              winner={bids[0].user ? bids[0].user : bids[0].title}
              prize={bids[0].prize ? `${bids[0].prize} ${getCurrencySymbol(room.currency)}` : ''}
            />
          : null}
          {bids && bids.length > 0 ?
            bids.map((bid, index) =>
              <Bid
                bid={bid}
                bids={bids}
                room={room}
                user={user}
                index={index}
                key={bid.bid_id}
                getBidInfo={(bidId, userId) => this.getBidInfo(bidId, userId)}
              />
            )
          : null}
        </div>
        <div className={s.background} style={mainBackground}></div>
        <UserTeamDetails
          isActive={this.state.isUserBidShown}
          isSearchActive={this.state.isSearchActive}
          team={this.props.singleBidInfo}
          players={this.props.players}
          teams={this.props.teams}
          roomStats={this.props.stats}
          currentLocale={this.props.currentLocale}
          onClose={() => this.closeUserBidPanel()}
          openPlayerStats={playerId => {
            this.openComparePlayerStats(playerId);
          }}
        />
        <PlayerInfo
          isReadOnly
          isActive={this.state.isUserTeamPlayerStatsShown}
          players={this.props.players}
          teams={this.props.teams}
          stats={this.props.allPlayersStats}
          allPlayers={this.props.players}
          playerStats={this.props.comparePlayerStats}
          closePlayerStats={() => this.closePlayerStats()}
        />
      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    room: getRoomData,
    bids: filterRoomMembersSelector,
    stats: getRoomStats,
    singleBidInfo: getRoomSingleBidInfo,
    user: authModule.selectors.getUser,
    players: playersModule.selectors.getPlayers,
    teams: teamsModule.selectors.getTeams,
    allPlayersStats: playersModule.selectors.getPlayersStats,
    comparePlayerStats: myteamModule.selectors.getCollectTeamStateComparePlayerStats,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(RoomUsers));
