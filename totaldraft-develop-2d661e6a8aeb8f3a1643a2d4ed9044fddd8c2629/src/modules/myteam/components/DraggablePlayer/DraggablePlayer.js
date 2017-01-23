import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import find from 'lodash/find';
import { DragSource } from 'react-dnd';
import { statsApiUrl } from 'config';
import { getPlayerShortName, convertToMillion, getPropByLocale } from 'utils';
import s from './DraggablePlayer.css';
import { positionsMap } from '../../constants';

const widgetSource = {
  beginDrag(props) {
    return props;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DraggablePlayer extends Component {

  static propTypes = {
    teams: PropTypes.array.isRequired,
    canDrop: PropTypes.bool.isRequired,
    player: PropTypes.object.isRequired,
    filterByPosition: PropTypes.func.isRequired,
    removePlayerFromMyTeam: PropTypes.func.isRequired,
    openTeamPlayerStats: PropTypes.func.isRequired,
    budgetPerPlayer: PropTypes.string,
    isReservePlayer: PropTypes.bool,
    currentLocale: PropTypes.string.isRequired,
    togglePlayerListOnMobile: PropTypes.func.isRequired,

    // Injected by React DnD
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  static contextTypes = {
    getPlayerAchievements: PropTypes.func.isRequired
  };

  getTeamUniform(teamId) {
    const { teams } = this.props;
    const team = find(teams, t => t.team_id === teamId);
    return team ? `${statsApiUrl}${team.uniform}` : '';
  }

  removePlayerFromMyTeam(player) {
    this.props.removePlayerFromMyTeam(player);
  }

  render() {
    const { budgetPerPlayer, player, connectDragSource, currentLocale, togglePlayerListOnMobile,
      filterByPosition, openTeamPlayerStats } = this.props;
    const convertedBudget = convertToMillion(budgetPerPlayer);
    const convertedPrice = convertToMillion(player.price);

    return connectDragSource(
      <div className={cx(s.player, { [s.playerIsDragAvailable]: this.props.canDrop, [s.isReservePlayer]: this.props.isReservePlayer })}>
        {player.id ?
          <div>
            <div className={s.playerUniform} onClick={() => openTeamPlayerStats(player.id)}>
              <div className={s.playerShadow}></div>
              <img className={s.playerUniformImg} src={this.getTeamUniform(player.team_id)} role="presentation" />
            </div>
            <div className={s.playerName}>
              {getPlayerShortName(getPropByLocale(player.i18n, currentLocale))}
            </div>
            <div className={s.playerPrice}>{convertedPrice}</div>
            <div className={s.playerAchievements}>{this.context.getPlayerAchievements(player.id)}</div>
            <div className={s.removePlayer} onClick={() => this.removePlayerFromMyTeam(player)}>&times;</div>
            <div className={s.playerNumber}>{player.number}</div>
          </div>
          :
          <div onClick={() => togglePlayerListOnMobile(true)}>
            <div className={s.playerUniform} onClick={() => filterByPosition(player.pos)}>
              <span className={s.playerPosition}>{positionsMap[player.pos]}</span>
              <img className={s.playerUniformImg} src="/images/football_uniform.svg" role="presentation" />
            </div>
            <div className={s.playerName}></div>
            <div className={s.playerPrice}>{convertedBudget}</div>
          </div>
        }
      </div>
    );
  }
}

export default DragSource('player', widgetSource, collect)(withStyles(s)(DraggablePlayer));
