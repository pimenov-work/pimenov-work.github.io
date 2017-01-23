import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TeamLineForSpecificPosition.css';
import DraggablePlayerContainer from '../DraggablePlayerContainer';
import { checkAvailablePositionInMyTeam } from '../../../../utils';

class TeamLineForSpecificPosition extends Component {

  static propTypes = {
    teams: PropTypes.array,
    players: PropTypes.array,
    maxCount: PropTypes.number,
    position: PropTypes.string,
    myTeam: PropTypes.object,
    cls: PropTypes.string.isRequired,
    filterByPosition: PropTypes.func,
    swapPlayersMyTeam: PropTypes.func,
    removePlayerFromMyTeam: PropTypes.func,
    openTeamPlayerStats: PropTypes.func,
    budgetPerPlayer: PropTypes.string
  };

  render() {
    const { players } = this.props;
    const allTeamPlayers = this.props.myTeam.players;

    const availablePosition = checkAvailablePositionInMyTeam(allTeamPlayers);

    return (
      <div className={this.props.cls}>
        {players.map(player => (
          <DraggablePlayerContainer
            teams={this.props.teams}
            player={player}
            key={player.id}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
        ))}
        {availablePosition[this.props.position] ?
          <DraggablePlayerContainer
            teams={this.props.teams}
            player={{ pos: this.props.position, isMain: true }}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
        : null}
      </div>);
  }
}

export default withStyles(s)(TeamLineForSpecificPosition);
