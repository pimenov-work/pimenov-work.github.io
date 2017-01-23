import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import groupBy from 'lodash/groupBy';
import cx from 'classnames';
import ConfirmBidDeletePopup from 'components/Popups/ConfirmBidDeletePopup';
import PlayerInfo from 'components/PlayerInfo';
import { ROOM_STATUS_NEW, DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM } from 'config';
import { getCookie } from 'utils';
import { navigate } from 'routes/actions';
import authModule from 'modules/auth';
import playersModule from 'modules/players';
import teamsModule from 'modules/teams';
import myteamModule from 'modules/myteam';
import intlModule from 'modules/intl';
import s from './RoomTeams.css';
import Userbid from './Userbid';
import TemplatesPanel from '../TemplatesPanel';
import TeamDetails from '../TeamDetails';
import { getRoomData, getActiveUserbids, getRoomStats, getBids } from '../../selectors';
import { deleteBid } from '../../actions';
import messages from './messages';

class RoomTeams extends Component {

  static propTypes = {
    room: PropTypes.object.isRequired,
    userbids: PropTypes.array,
    templates: PropTypes.array,
    dispatch: PropTypes.func,
    players: PropTypes.array.isRequired,
    allPlayers: PropTypes.array.isRequired,
    allPlayersStats: PropTypes.array,
    playerStats: PropTypes.object,
    currentLocale: PropTypes.string.isRequired,

    bids: PropTypes.array,
    teams: PropTypes.array.isRequired,
    roomStats: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isTeamDetailsShown: false,
      isTemplatesPanelShown: false,
      openedTemplate: {},
      isBidDeletePopupShown: false,
      bidToPopup: null,
      isInvalidBidPopupShown: false,
      isBetPopupShown: false,
      isPlayerStatsShown: false,
      invalidBidMessage: null,
      isBidLimitPopupShown: false
    };
  }

  openTeamDetails(template) {
    this.setState({ isTeamDetailsShown: true, openedTemplate: template });
  }

  closeTeamDetails() {
    this.setState({ isTeamDetailsShown: false });
  }

  openBidDeletePopup(bid) {
    this.setState({ isBidDeletePopupShown: true, bidToPopup: bid });
  }

  deleteBidSubmit(bidId) {
    const { dispatch, room } = this.props;
    const token = getCookie('access_token');

    if (token) {
      dispatch(deleteBid(room.room_id, bidId, token));

      this.setState({
        isBidDeletePopupShown: false,
        isTeamDetailsShown: false,
        openedTemplate: {},
        bidToPopup: null
      });
    }
  }

  openPlayerStats(playerId) {
    const { dispatch, room } = this.props;
    const tournamentId = room.tournaments[0];
    dispatch(myteamModule.actions.fetchPlayerStats(tournamentId, playerId)).then(response => {
      if (!response.error && response.data.aggr) {
        setTimeout(() => this.setState({ isPlayerStatsShown: true }), 100);
      } else {
        this.setState({ isPlayerStatsShown: false });
      }
    });
  }

  closePlayerStats() {
    this.setState({ isPlayerStatsShown: false });
  }

  getTeamsIdsWhichNotFitsOnMaxPlayersCount(bid, maxPlayersFromOneTeam = DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM) {
    const { room } = this.props;

    const teamsIds = [];
    const teamPlayers = [];

    if (room) {
      maxPlayersFromOneTeam = room.plr_per_team;
    }

    if (bid && bid.main && bid.reserve) {
      bid.main.forEach(playerId => teamPlayers.push(this.getPlayerById(playerId)));
      bid.reserve.forEach(playerId => teamPlayers.push(this.getPlayerById(playerId)));

      const groupedPlayersByTeam = groupBy(teamPlayers, player => player ? player.team_id : null);

      for (let teamId in groupedPlayersByTeam) {
        if (groupedPlayersByTeam[teamId].length > maxPlayersFromOneTeam) {
          teamsIds.push(parseInt(teamId, 10));
        }
      }
    }

    return teamsIds;
  }

  getPlayerById(playerId) {
    const { players } = this.props;
    return players.find(p => p.id === playerId);
  }

  getPlayerPriceById(playerId) {
    return this.getPlayerById(playerId).price || 0;
  }

  render() {
    const { dispatch, userbids, templates, teams, players, room, roomStats,
      bids, allPlayersStats, playerStats, currentLocale } = this.props;

    const locale = currentLocale.substring(0, 2);
    let mainBackground = { backgroundImage: `url('/images/make_your_team_${locale}.svg')` };
    if (room.status !== ROOM_STATUS_NEW) {
      mainBackground = {
        backgroundImage: `url('/images/good_luck_${locale}.svg')`
      };
    }

    return (
      <section className={cx(s.teams, { [s.teamsIsHiddenOnMobile]: userbids && userbids.length === 0 })}>
        <header className={s.header}>
          <div className={s.headerTitle}>
            <div className={s.headerTitleText}>
              <FormattedMessage {...messages.title} />
              {room.bids_per_user ?
                <span className={s.headerTitleLimit}>{`${userbids.length} / ${room.bids_per_user}`}</span>
              : null}
            </div>
            <div className={s.headerRoomBids}>{ userbids ? userbids.length * room.fee : 0} ₽</div>
          </div>
          <div className={cx(s.tableHeader, { [s.roomIsActive]: room.status === ROOM_STATUS_NEW })}>
            <div className={s.tableItemTitle}>
              <FormattedMessage {...messages.tableTeams} />
            </div>
            <div className={s.tableItemPrice}>
              <FormattedMessage {...messages.tableBet} />
            </div>
            <div className={s.tableItemPoints}>
              <FormattedMessage {...messages.tablePoints} />
            </div>
            <div className={s.tableItemPlace}>
              <FormattedMessage {...messages.tablePlace} />
            </div>
            <div className={s.tableItemControls}></div>
          </div>
        </header>
        <div className={s.list}>
          <section className={s.section}>
            {userbids && userbids.length > 0 ?
              userbids.map((bid) =>
                <Userbid
                  bid={bid}
                  bids={bids}
                  room={room}
                  key={bid.bid_id}
                  openTeamDetails={() => this.openTeamDetails(bid)}
                  editTeam={() => dispatch(navigate(`/rooms/${room.room_id}/teams/${bid.bid_id}`))}
                />
              )
            : null}
          </section>
          { (room && room.status === ROOM_STATUS_NEW) &&
            (userbids.length < room.bids_per_user) &&
            (!room.users_limit || room.users_limit - room.users > 0)
            ?
              <div
                className={s.teamAddBtn}
                onClick={() => {
                  if (userbids.length === room.bids_per_user) {
                    this.setState({ isBidLimitPopupShown: true });
                  } else {
                    if (templates && templates.length > 0) {
                      this.setState({ isTemplatesPanelShown: true });
                    } else {
                      dispatch(navigate(`/rooms/${room.room_id}/teams`));
                    }
                  }
                }}
              >
                <FormattedMessage {...messages.addTeamLabel} />
              </div>
            : null}
        </div>

        <div className={s.background} style={mainBackground}></div>

        <TemplatesPanel
          isActive={this.state.isTemplatesPanelShown}
          onClosePanel={() => this.setState({ isTemplatesPanelShown: false })}
          openTeamDetails={(team) => this.openTeamDetails(team)}
        />

        <TeamDetails
          isActive={this.state.isTeamDetailsShown}
          template={this.state.openedTemplate}
          players={players}
          room={room}
          roomId={room.room_id}
          teams={teams}
          roomStats={roomStats}
          currentLocale={currentLocale}
          openPlayerStats={(playerId) => this.openPlayerStats(playerId)}
          getTeamsIdsWhichNotFitsOnMaxPlayersCount={(bid, maxPlayersFromOneTeam) => this.getTeamsIdsWhichNotFitsOnMaxPlayersCount(bid, maxPlayersFromOneTeam) }
          closeTeamDetails={() => this.closeTeamDetails()}
          deleteBid={(bid) => this.openBidDeletePopup(bid)}
        />

        <PlayerInfo
          isReadOnly
          isActive={this.state.isPlayerStatsShown}
          addPlayerIntoMyTeam={() => {}}
          players={players}
          teams={teams}
          stats={allPlayersStats}
          playerStats={playerStats}
          closePlayerStats={() => this.closePlayerStats() }
          allPlayers={this.props.allPlayers}
        />

        <ConfirmBidDeletePopup
          isOpen={this.state.isBidDeletePopupShown}
          bid={this.state.bidToPopup}
          onSubmit={(bidId) => this.deleteBidSubmit(bidId)}
          onClose={() => this.setState({ isBidDeletePopupShown: false, bidToPopup: null })}
        />

      </section>
    );
  }
}

export default connect(
  createStructuredSelector({
    room: getRoomData,
    userbids: getActiveUserbids,
    bids: getBids,
    roomStats: getRoomStats,
    teams: teamsModule.selectors.getTeams,
    templates: authModule.selectors.getUserTemplates,
    players: playersModule.selectors.getPlayers,
    allPlayers: playersModule.selectors.getPlayers,
    allPlayersStats: playersModule.selectors.getPlayersStats,
    playerStats: myteamModule.selectors.getCollectTeamStatePlayerStats,
    currentLocale: intlModule.selectors.getLocale
  })
)(withStyles(s)(RoomTeams));
