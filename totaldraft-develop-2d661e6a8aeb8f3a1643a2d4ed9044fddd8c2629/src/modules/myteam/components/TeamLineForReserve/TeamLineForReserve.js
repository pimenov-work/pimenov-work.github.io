import React, { Component, PropTypes } from 'react';
import s from './TeamLineForReserve.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import DraggablePlayerContainer from '../DraggablePlayerContainer';
import { PLAYER_POSITIONS_G, PLAYER_POSITIONS_D, PLAYER_POSITIONS_M,
  PLAYER_POSITIONS_F, RESERVE_PLAYERS_SIZE } from '../../constants';
import messages from './messages';

class TeamLineForReserve extends Component {

  static propTypes = {
    teams: PropTypes.array.isRequired,
    reserve: PropTypes.array.isRequired,
    filterByPosition: PropTypes.func.isRequired,
    swapPlayersMyTeam: PropTypes.func.isRequired,
    removePlayerFromMyTeam: PropTypes.func.isRequired,
    budgetPerPlayer: PropTypes.string
  };

  render() {
    const position = [PLAYER_POSITIONS_F, PLAYER_POSITIONS_M, PLAYER_POSITIONS_D, PLAYER_POSITIONS_G];
    const reserves = [];

    this.props.reserve.forEach(reserve => {
      if (reserve) {
        reserves[position.indexOf(reserve.pos)] = <DraggablePlayerContainer
          key={position.indexOf(reserve.pos)}
          teams={this.props.teams}
          player={reserve}
          budgetPerPlayer={this.props.budgetPerPlayer}
          isReservePlayer
          filterByPosition={this.props.filterByPosition}
          swapPlayersMyTeam={this.props.swapPlayersMyTeam}
          removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
          openTeamPlayerStats={this.props.openTeamPlayerStats}
        />;
      }
    });

    for (let i = 0; i < RESERVE_PLAYERS_SIZE; i++) {
      if (!reserves[i]) {
        reserves[i] = <DraggablePlayerContainer
          player={{ pos: position[i] }}
          teams={this.props.teams}
          filterByPosition={this.props.filterByPosition}
          key={i}
          budgetPerPlayer={this.props.budgetPerPlayer}
          isReservePlayer
          swapPlayersMyTeam={this.props.swapPlayersMyTeam}
          removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
          openTeamPlayerStats={this.props.openTeamPlayerStats}
        />;
      }
    }

    return (
      <div className={s.positionReserve}>
        <div className={s.posTitle}>
          <FormattedMessage {...messages.reserveTitle} />
        </div>
        {reserves.map((r, i) =>
          <div className={s.pos} key={i}>
            {r}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s)(TeamLineForReserve);
