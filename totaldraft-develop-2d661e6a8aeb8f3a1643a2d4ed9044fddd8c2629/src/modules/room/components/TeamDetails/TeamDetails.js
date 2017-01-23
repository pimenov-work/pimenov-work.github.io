import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import s from './TeamDetails.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IconSVG from 'components/IconSVG';
import PlayerStatsGraph from 'components/PlayerStatsGraph';
import { positionsMap } from '../../../myteam/constants';
import { statsApiUrl, ROOM_STATUS_NEW } from 'config';
import { getPlayerShortName, convertToMillion, sortPlayers, getPropByLocale } from 'utils';
import messages from './messages';

class TeamDetails extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    closeTeamDetails: PropTypes.func.isRequired,
    deleteBid: PropTypes.func,
    players: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    template: PropTypes.object,
    roomId: PropTypes.number.isRequired,
    room: PropTypes.object,
    roomStats: PropTypes.object,
    openPlayerStats: PropTypes.func,
    currentLocale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    getPlayerAchievements: PropTypes.func.isRequired
  };

  getPlayerById(id) {
    const { players } = this.props;
    return players.find(p => p.id === id);
  }

  getTeam(teamId) {
    const { teams } = this.props;
    const team = teams ? teams.find(t => t.team_id === teamId) : undefined;
    return team;
  }

  getPlayerPoints(id) {
    const { players } = this.props.roomStats;
    const player = players.find(p => p.player_id === id);
    return player ? player.score : '0';
  }

  getTeamPrice(template) {
    const { players } = this.props;
    if (players && template.main && template.reserve) {
      const teamPlayers = template.main.concat(template.reserve);
      const team = [];

      teamPlayers.forEach(item => {
        let p = players.find(player => player.id === item);
        if (p) {
          team.push(p);
        }
      });

      const totalPrice = team.reduce((price, player) => price + player.price, 0);

      return totalPrice;
    }
  }

  getPlayersElements(squad, notFitTeamsIds) {
    const { template, currentLocale, players } = this.props;
    const elements = [];

    const sorted = sortPlayers(squad, players);

    if (sorted && sorted.length > 0) {
      sorted.forEach(p => {
        let player = this.getPlayerById(p);
        let team = player && player.team_id ? this.getTeam(player.team_id) : undefined;
        let teamName = team ? getPropByLocale(team.i18n, currentLocale) : '';
        let teamUniform = team ? `${statsApiUrl + team.uniform}` : '';
        let isNotFit = player && player.team_id ? notFitTeamsIds.indexOf(player.team_id) !== -1 : false;

        if (player && teamName) {
          elements.push(
            <div
              className={cx(s.player, { [s.isNotFit]: isNotFit })}
              key={p}
              onClick={() => this.props.openPlayerStats(player.id)}
            >
              <div className={s.playerPosition}>{positionsMap[player.pos]}</div>
              <div className={s.playerName}>
                <img className={s.playerUniformImg} src={teamUniform} />
                <div className={s.playerNameLabel}>
                  {getPlayerShortName(getPropByLocale(player.i18n, currentLocale))}
                </div>
                <div className={s.playerAchievements}>
                  {this.context.getPlayerAchievements(p)}
                </div>
              </div>
              <div className={s.playerClub}>
                {teamName}
              </div>
              {template.bid_id ?
                <div className={s.playerScore}>
                  {this.getPlayerPoints(player.id)}
                </div>
                :
                <div className={s.playerScore}>
                  <PlayerStatsGraph player={player} cssClass={s.statsGraph} dX={4} dY={1} />
                  {(player.avg || player.avg === 0) ? player.avg.toPrecision(2) : '-'}
                </div>
              }
              {/* <div className={s.playerControls}></div> */}
            </div>
          );
        } else {
          elements.push(
            <div className={s.player} key={p}>
              <div className={s.playerPosition}>-</div>
              <div className={s.playerName}>
                <div className={s.invalidPlayerNameLabel}>
                  {player && !teamName ?
                    <FormattedMessage {...messages.playerDisabled} /> :
                    <FormattedMessage {...messages.playerRevoked} />
                  }
                </div>
              </div>
              <div className={s.playerClub}>-</div>
              <div className={s.playerScore}>-</div>
              {/* <div className={s.playerControls}></div> */}
            </div>
          );
        }
      });
    }

    return elements;
  }

  render() {
    const { isActive, template, deleteBid, room } = this.props;
    const notFitTeamsIds = this.props.getTeamsIdsWhichNotFitsOnMaxPlayersCount(template);
    const playersMainElements = this.getPlayersElements(template.main, notFitTeamsIds);
    const playersReserveElements = this.getPlayersElements(template.reserve, notFitTeamsIds);

    return (
      <section className={cx(s.root, { [s.isActive]: isActive })}>
        <header className={s.header}>
          <div className={s.headerSection}>
            <div className={s.headerTitle}>
              <div className={s.headerClose} onClick={this.props.closeTeamDetails}>
                <IconSVG icon="smart-arrow-left" size="22" cssClass={s.dismissBtn} />
              </div>
              <div className={s.headerTeamName}>{template.title} </div>
              {template.place ?
                <div className={s.headerTeamPlace}>
                  <FormattedMessage {...messages.placeLabel} />
                  {`: ${template.place}`}
                </div>
              : null}
              {template.score ?
                <div className={s.headerTeamScore}>
                  <FormattedMessage {...messages.pointsLabel} />
                  {`: ${template.score}`}
                </div>
              : null}
            </div>
            { room && room.status === ROOM_STATUS_NEW && template.bid_id ?
              <div className={s.headerTeamDelete} onClick={() => deleteBid(template)}>
                <IconSVG icon="delete-icon" size="24" />
              </div>
              : null
            }
          </div>
          <div className={s.subheader}>
            <FormattedMessage {...messages.mainTeamLabel} />
            <div className={cx(s.subheaderPrice, { [s.subheaderAlert]: template && room && (this.getTeamPrice(template) > room.plr_price_limit) })}>
              {template && room ?
                <span>
                  <FormattedMessage {...messages.budgetLabel} />
                  {`: ${convertToMillion(this.getTeamPrice(template))} / ${convertToMillion(room.plr_price_limit)}`}
                </span>
              : null}
            </div>
          </div>
          <div className={s.tableHeader}>
            <div className={s.tableHeaderPosition}><FormattedMessage {...messages.tableHeaderPos} /></div>
            <div className={s.tableHeaderName}><FormattedMessage {...messages.tableHeaderPlayer} /></div>
            <div className={s.tableHeaderClub}><FormattedMessage {...messages.tableHeaderClub} /></div>
            <div className={s.tableHeaderScore}><FormattedMessage {...messages.tableHeaderPoints} /></div>
            {/* <div className={s.tableHeaderControls}></div> */}
          </div>
        </header>
        <div className={s.players}>
          {playersMainElements}
          <div className={s.playersTitle}>
            <FormattedMessage {...messages.reserveTeamLabel} />
          </div>
          {playersReserveElements}
        </div>
      </section>
    );
  }
}

export default withStyles(s)(TeamDetails);
