import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';
import s from './FutureGames.css';
import Link from 'components/Link';
import IconSVG from 'components/IconSVG';
import FutureRoom from '../FutureRoom';
import { convertToMillion, sortPlayers, getPropByLocale } from 'utils';
import { BID_STATUS_CANCELED, statsApiUrl } from 'config';
import { positionsMap } from '../../../myteam/constants';
import messages from './messages';

class FutureGamesContainer extends Component {

  static propTypes = {
    rooms: PropTypes.array,
    bids: PropTypes.array,
    players: PropTypes.array,
    teams: PropTypes.array,
    tournaments: PropTypes.array,
    currentLocale: PropTypes.string.isRequired,
  };

  getBidRooms(bids) {
    const { currentLocale } = this.props;
    const res = [];
    const usedRooms = [];
    bids.map(bid => {
      let room = bid.room;
      if (usedRooms.indexOf(room.room_id) === -1) {
        res.push(
          <FutureRoom
            room={room}
            bid={bid}
            key={room.room_id}
            currentLocale={currentLocale}
          />
        );
        usedRooms.push(room.room_id);
      }
    });
    return res;
  }

  getTeamPrice(template) {
    const { players } = this.props;
    if (players && template.main && template.reserve) {
      const teamPlayers = template.main.concat(template.reserve);
      const team = [];

      teamPlayers.forEach(item => {
        const player = players.find(p => p.id === item);
        if (player) {
          team.push(player);
        }
      });

      return team.reduce((memo, player) => memo + player.price, 0);
    }
  }

  getPlayersPos(position) {
    let pos;
    switch (position) {
      case 'F':
        pos = positionsMap.F;
        break;
      case 'M':
        pos = positionsMap.M;
        break;
      case 'D':
        pos = positionsMap.D;
        break;
      case 'G':
        pos = positionsMap.G;
        break;
      default:
        pos = '';
    }
    return pos;
  }

  getPlayerAchievements(room, playerId) {
    const injures = room.missing.ij;
    const rc = room.missing.rc;

    const injuryIcon = injures && injures.indexOf(playerId) > -1 ? <IconSVG icon="player-injure-icon" size="12" /> : null;
    const redCardIcon = rc && rc.indexOf(playerId) > -1 ? <IconSVG icon="red-card-icon" size="14" /> : null;

    const achievements = injuryIcon || redCardIcon ? (<div>{injuryIcon}{redCardIcon}</div>) : null;

    return achievements;
  }

  getTeam(room, playerIds) {
    const { players, currentLocale } = this.props;
    const team = [];
    const sorted = sortPlayers(playerIds, players);

    sorted.forEach(item => {
      const p = players.find(player => player.id === item);

      if (p) {
        team.push(
          <div className={s.teamPlayer} key={p.id}>
            <div className={s.teamPlayerForm}>
              <img className={s.playerUniformImg} src={this.getTeamUniform(p.team_id)} role="presentation" />
              <div className={s.playerPositionLetter}>{this.getPlayersPos(p.pos)}</div>
            </div>
            <div className={s.teamPlayerName}>
              {this.buildShortName(getPropByLocale(p.i18n, currentLocale))}
            </div>
            <div className={s.teamPlayerPrice}>{convertToMillion(p.price)}</div>
            <div className={s.teamPlayerAchieves}>{this.getPlayerAchievements(room, p.id)}</div>
          </div>
        );
      }
    });
    return team;
  }

  getTeamUniform(teamId) {
    const { teams } = this.props;
    const team = teams ? teams.find(t => t.team_id === teamId) : null;
    return team ? statsApiUrl + team.uniform : false;
  }

  getTournamentLogo(tournamentId) {
    const { tournaments } = this.props;
    const tourWithLogo = tournaments.find(tour => tour.tournament_id === tournamentId);
    return tourWithLogo.logo;
  }

  buildShortName(fullName) {
    return fullName && fullName.substr(fullName.indexOf(' ') + 1);
  }

  isEqualBids(bid1, bid2) {
    // TODO: verify if main and reserve is equal
    return bid1.title === bid2.title && this.getTeamPrice(bid1) === this.getTeamPrice(bid2);
  }

  render() {
    const { rooms, bids, tournaments, currentLocale } = this.props;

    // TODO: That should be done by server
    const filteredBids = bids.filter(bid => bid.status !== BID_STATUS_CANCELED);

    // TODO: Review this
    filteredBids.forEach(bid => {
      bid.room = rooms.filter(room => room.room_id === bid.room_id)[0];
    });

    const sortedBids = sortBy(filteredBids, a => a.title);

    let groupedBids = [];
    const roundSortedBids = sortedBids;
    if (roundSortedBids && roundSortedBids.length > 0) {
      let previousBid = roundSortedBids[0];
      let similarBids = [roundSortedBids[0]];

      for (let i = 1; i < roundSortedBids.length; i++) {
        if (!this.isEqualBids(roundSortedBids[i], previousBid)) {
          groupedBids.push({
            title: previousBid.title,
            similarBids,
            main: previousBid.main,
            reserve: previousBid.reserve,
            key: previousBid.bid_id,
            tournamentId: previousBid.room.tournaments[0],
            room: previousBid.room
          });
          similarBids = [];
          previousBid = roundSortedBids[i];
        }

        similarBids.push(roundSortedBids[i]);
      }

      groupedBids.push({
        title: previousBid.title,
        main: previousBid.main,
        reserve: previousBid.reserve,
        key: previousBid.bid_id,
        similarBids,
        tournamentId: previousBid.room.tournaments[0],
        room: previousBid.room
      });
    }

    const isTournaments = tournaments.length > 0;

    groupedBids = sortBy(groupedBids, bid => new Date(bid.room.freeze));

    const noGamesBackground = { backgroundImage: `url('/images/no_games_${currentLocale.substring(0, 2)}.svg')` };

    return (
      <section className={s.root}>
        {groupedBids.length > 0 ?
          groupedBids.map(bid => (
            <div className={s.bid} key={bid.key}>
              <section className={s.team}>
                <div className={s.titleLogoContainer}>
                  {isTournaments
                    ? <div className={s.tourLogo} style={{ backgroundImage: `url('${statsApiUrl}${this.getTournamentLogo(bid.tournamentId)}')` }}></div>
                    : null
                  }
                  <div className={s.titleContainer}>
                    <div className={s.teamTitle}>{bid.title}</div>
                    <div className={s.teamInfo}>
                      <div className={s.teamInfoBlock}>
                        <div className={s.teamInfoLabel}>
                          <FormattedMessage {...messages.budgetLabel} />:
                        </div>
                        <div className={s.teamInfoText}>
                          {convertToMillion(this.getTeamPrice(bid))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={s.teamPlayers}>
                  {this.getTeam(bid.room, bid.main)}
                  <div className={s.teamDelimer}></div>
                  {this.getTeam(bid.room, bid.reserve)}
                </div>
              </section>
              <div className={s.table}>
                <header className={s.tableHeader}>
                  <div className={s.tableHeaderRoom}>
                    <FormattedMessage {...messages.tableRoomLabel} />
                  </div>
                  <div className={s.tableHeaderPrice}>
                    <FormattedMessage {...messages.tablePrizeLabel} />
                  </div>
                  <div className={s.tableHeaderFee}>
                    <FormattedMessage {...messages.tableFeeLabel} />
                  </div>
                  <div className={s.tableHeaderPosition}>
                    <FormattedMessage {...messages.tableCountLabel} />
                  </div>
                  <div className={s.tableHeaderTime}>
                    <FormattedMessage {...messages.tableStartLabel} />
                  </div>
                  <div className={s.tableHeaderControls}></div>
                </header>
                {<div className={s.rooms}>
                  {this.getBidRooms(bid.similarBids)}
                </div>}
              </div>
            </div>
          ))
        :
            <div className={s.noGames}>
              <div className={s.noGamesBackground} style={noGamesBackground}></div>
              <div className={s.note}>
                <Link className={s.roomButton} to="/lobby">
                  <FormattedMessage {...messages.lobbyLinkLabel} />
                </Link>
              </div>
            </div>
        }
      </section>
    );
  }
}

export default withStyles(s)(FutureGamesContainer);
