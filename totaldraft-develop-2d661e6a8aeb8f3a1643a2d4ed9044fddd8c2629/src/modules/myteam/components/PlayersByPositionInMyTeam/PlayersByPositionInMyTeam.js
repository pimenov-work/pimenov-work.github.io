import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import s from './PlayersByPositionInMyTeam.css';
import IconSVG from 'components/IconSVG';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { statsApiUrl } from 'config';
import { getPlayerShortName, convertToMillion, getPropByLocale,
  checkAvailablePositionInMyTeam } from 'utils';
import messages from './messages';

class PlayersByPositionInMyTeam extends Component {

  static propTypes = {
    players: PropTypes.object.isRequired,
    teams: PropTypes.array.isRequired,
    maxCount: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    budgetPerPlayer: PropTypes.string,
    position: PropTypes.string,
    cssID: PropTypes.string,
    filterByPosition: PropTypes.func.isRequired,
    removePlayerMyTeam: PropTypes.func.isRequired,
    updateSelectedPlayerIndex: PropTypes.func.isRequired,
    selectedPlayerIndex: PropTypes.number,
    selectedPlayerPosition: PropTypes.string,
    openTeamPlayerStats: PropTypes.func,
    currentLocale: PropTypes.string.isRequired,
    myTeam: PropTypes.object
  };

  static contextTypes = {
    getPlayerAchievements: PropTypes.func.isRequired
  };

  getTeamName(teamId) {
    const { currentLocale, teams } = this.props;
    const team = find(teams, t => t.team_id === teamId);
    return team ? getPropByLocale(team.i18n, currentLocale) : '';
  }

  getTeam(id) {
    const { teams } = this.props;
    return teams ? find(teams, t => t.team_id === id) : null;
  }

  filterByPosition(postion, index) {
    this.props.updateSelectedPlayerIndex(index, postion);
    this.props.filterByPosition(postion);
  }

  removePlayerMyTeam(player) {
    this.props.removePlayerMyTeam(player);
  }

  render() {
    const { players, maxCount, title, budgetPerPlayer, position, cssID, currentLocale, myTeam } = this.props;
    const elements = [];
    const playersForCurrentPosition = players[position];
    const teamPlayers = myTeam.players;
    const availablePositions = checkAvailablePositionInMyTeam(teamPlayers);
    const teamReserve = groupBy(teamPlayers, p => !p.isMain ? p.pos : 'main');

    if (playersForCurrentPosition && playersForCurrentPosition.length > 0) {
      playersForCurrentPosition.forEach(player => {
        let team = this.getTeam(player.team_id);
        let teamUniform = team ? `${statsApiUrl + team.uniform}` : '';

        elements.push(
          <div className={s.player} key={player.id} onClick={() => this.props.openTeamPlayerStats(player.id) }>
            <div className={s.playerName}>
              <img className={s.playerUniformImg} src={teamUniform} role="presentation" />
              <div className={s.playerNameLabel}>
                {getPlayerShortName(getPropByLocale(player.i18n, currentLocale))}
              </div>
              <div className={s.playerAchievements}>
                {this.context.getPlayerAchievements(player.id)}
              </div>
            </div>
            <div className={s.playerClub}>{this.getTeamName(player.team_id)}</div>
            <div className={s.playerPrice}>{convertToMillion(player.price)}</div>
            <div className={s.playerControls}>
              <div
                className={s.removeBtn}
                onClick={e => {
                  e.stopPropagation();
                  this.removePlayerMyTeam(player);
                }}
              >
                <IconSVG icon="arrow-right" size="14" />
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div className={s.teammatesSection}>
        <div className={s.teammatesHeader} id={cssID}>
          <div className={s.teammatesHeaderPosition}>{title}</div>
          <div className={s.teammatesHeaderClub}>
            <FormattedMessage {...messages.tableTeamLabel} />
          </div>
          <div className={s.teammatesHeaderBadget}>
            <FormattedMessage {...messages.tablePriceLabel} />
          </div>
        </div>
        {elements}
        {!teamReserve[this.props.position] || (availablePositions && availablePositions[this.props.position]) ?
          <div
            className={cx(s.player, { [s.selectedPosition]: this.props.selectedPlayerPosition === this.props.position })}
            onClick={() => this.filterByPosition(position, playersForCurrentPosition ? playersForCurrentPosition.length : 0)}
          >
            <div className={s.playerAddBtn}>
              <FormattedMessage {...messages.addLabel} />
            </div>
            <div className={s.playerBadget}>{convertToMillion(budgetPerPlayer)}</div>
            <div className={s.playerControls}>
              <div className={s.addBtn}>
                <IconSVG icon="plus-icon" size="14" />
              </div>
            </div>
          </div>
        : null}
      </div>
    );
  }
}

export default withStyles(s)(PlayersByPositionInMyTeam);
