import React, { Component, PropTypes } from 'react';
import s from './Player.css';
import cx from 'classnames';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import { positionsMap } from '../../constants';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IconSVG from 'components/IconSVG';
import PlayerStatsGraph from 'components/PlayerStatsGraph';
import { statsApiUrl } from 'config';
import { convertToMillion, getPlayerShortName, getPropByLocale, checkAvailablePositionInMyTeam } from 'utils';

let availablePositions = null;

class Player extends Component {

  static propTypes = {
    room: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
    stats: PropTypes.array.isRequired,
    myTeam: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    addPlayerMyTeam: PropTypes.func.isRequired,
    openPlayerInfo: PropTypes.func.isRequired,
    competitionId: PropTypes.number.isRequired,
    fetchPlayerStats: PropTypes.func.isRequired,
    addPlayerIntoMyTeam: PropTypes.func.isRequired,
    resetGuide: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
  };

  componentDidMount() {
    availablePositions = checkAvailablePositionInMyTeam(this.props.myTeam.players);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.myTeam.players.length !== newProps.myTeam.players.length) {
      availablePositions = checkAvailablePositionInMyTeam(newProps.myTeam.players);
    }
  }

  getTeamName(id) {
    const { currentLocale } = this.props;
    const team = find(this.props.teams, t => t.team_id === id);

    return team ? getPropByLocale(team.i18n, currentLocale) : '';
  }

  getTeam(id) {
    return this.props.teams ? find(this.props.teams, t => t.team_id === id) : {};
  }

  isPlayerInjured(playerId) {
    const { room } = this.props;
    const injures = room.missing.ij;

    return injures && injures.indexOf(playerId) > -1;
  }

  isPlayerGotRedCard(playerId) {
    const { room } = this.props;
    const rc = room.missing.rc;

    return rc && rc.indexOf(playerId) > -1;
  }

  openPlayerStats(player) {
    this.props.fetchPlayerStats(this.props.competitionId, player.id).then(response => {
      if (!response.error && response.data.aggr) {
        setTimeout(() => {
          this.props.openPlayerInfo();
        }, 100);
      }
    });
  }

  render() {
    const { player, room, currentLocale } = this.props;
    const teamPlayers = this.props.myTeam.players;

    const playersGroupedByTeam = groupBy(teamPlayers, p => p.team_id);

    const teamReserve = groupBy(teamPlayers, p => !p.isMain ? p.pos : 'main');

    const team = player ? this.getTeam(player.team_id) : {};
    const teamUniform = team ? statsApiUrl + (team || {}).uniform : '';

    const playerClass = cx(s.player, {
      [s.playerDisabled]: playersGroupedByTeam[player.team_id] && playersGroupedByTeam[player.team_id].length === room.plr_per_team,
      [s.playerPosDisabled]: teamReserve[player.pos] && (availablePositions && !availablePositions[player.pos]),
      [s.playerDisallowed]: this.isPlayerGotRedCard(player.id)
    });

    const convertedPrice = convertToMillion(player.price);

    return (
      <div className={playerClass} onClick={() => this.openPlayerStats(player)}>
        <div className={s.playerControls}>
          <div
            className={s.addBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.props.addPlayerIntoMyTeam(player);
              this.props.resetGuide();
            }}
          >
            <IconSVG icon="arrow-left" size="14" />
          </div>
        </div>
        <div className={s.playerPosition}>{positionsMap[player.pos]}</div>
        <div className={s.playerName}>
          <img className={s.playerUniformImg} src={teamUniform} role="presentation" />
          <div className={s.playerNameLabel}>
            {getPlayerShortName(getPropByLocale(player.i18n, currentLocale))}
          </div>
          <div className={s.playerAchievements}>
            {this.isPlayerInjured(player.id) ?
              <IconSVG icon="player-injure-icon" size="12" />
            : null}
            {this.isPlayerGotRedCard(player.id) ?
              <IconSVG icon="red-card-icon" size="14" />
            : null}
          </div>
        </div>
        <div className={s.playerClub}>
          {this.getTeamName(player.team_id)}
        </div>
        <div className={s.playerCounts}>
          {player ? <PlayerStatsGraph player={player} cssClass={s.statsGraph} dX={4} dY={1} /> : null}
          {player && (player.avg || player.avg === 0) ? player.avg.toPrecision(2) : '-'}
        </div>
        <div className={s.playerPrice}>{convertedPrice}</div>
      </div>
    );
  }
}

export default withStyles(s)(Player);
