import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import groupBy from 'lodash/groupBy';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TeamBuilderField.css';
import TeamLineForReserve from '../TeamLineForReserve';
import TeamLineForSpecificPosition from '../TeamLineForSpecificPosition';
import { PLAYER_POSITIONS_G, PLAYER_POSITIONS_D,
         PLAYER_POSITIONS_M, PLAYER_POSITIONS_F,
         maxPlayerSizePerPosition } from '../../constants';

class TeamBuilderField extends Component {

  static propTypes = {
    teams: PropTypes.array.isRequired,
    myTeam: PropTypes.object.isRequired,
    filterByPosition: PropTypes.func.isRequired,
    swapPlayersMyTeam: PropTypes.func.isRequired,
    removePlayerFromMyTeam: PropTypes.func.isRequired,
    openTeamPlayerStats: PropTypes.func.isRequired,
    budgetPerPlayer: PropTypes.string
  };

  getSquad() {
    const { players } = this.props.myTeam;
    const squad = {
      forwards: [],
      midfielders: [],
      defenders: [],
      goalkeepers: [],
      reserve: []
    };

    if (players && players.length > 0) {
      const groupPlayersByPosition = groupBy(players, p => p.pos);

      if (groupPlayersByPosition.F) {
        groupPlayersByPosition.F.forEach(p => {
          if (p && p.isMain) { squad.forwards.push(p); }
          else { squad.reserve.push(p); }
        });
      }

      if (groupPlayersByPosition.M) {
        groupPlayersByPosition.M.forEach(p => {
          if (p && p.isMain) { squad.midfielders.push(p); }
          else { squad.reserve.push(p); }
        });
      }

      if (groupPlayersByPosition.D) {
        groupPlayersByPosition.D.forEach(p => {
          if (p && p.isMain) { squad.defenders.push(p); }
          else { squad.reserve.push(p); }
        });
      }

      if (groupPlayersByPosition.G) {
        groupPlayersByPosition.G.forEach(p => {
          if (p && p.isMain) { squad.goalkeepers.push(p); }
          else { squad.reserve.push(p); }
        });
      }
    }

    return squad;
  }

  render() {
    const squad = this.getSquad();

    return (
      <section className={s.root}>
        <div className={s.main}>
          <div className={s.fieldBackground}></div>
          <div className={s.positionForward}></div>
          <TeamLineForSpecificPosition
            teams={this.props.teams}
            myTeam={this.props.myTeam}
            cls={s.positionForward}
            players={squad.forwards}
            maxCount={maxPlayerSizePerPosition.F}
            position={PLAYER_POSITIONS_F}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
          <TeamLineForSpecificPosition
            teams={this.props.teams}
            myTeam={this.props.myTeam}
            cls={s.positionMidfielders}
            players={squad.midfielders}
            maxCount={maxPlayerSizePerPosition.M}
            position={PLAYER_POSITIONS_M}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
          <TeamLineForSpecificPosition
            teams={this.props.teams}
            myTeam={this.props.myTeam}
            cls={s.positionDefenders}
            players={squad.defenders}
            maxCount={maxPlayerSizePerPosition.D}
            position={PLAYER_POSITIONS_D}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
          <TeamLineForSpecificPosition
            teams={this.props.teams}
            myTeam={this.props.myTeam}
            cls={s.positionGoalkeepers}
            players={squad.goalkeepers}
            maxCount={maxPlayerSizePerPosition.G}
            position={PLAYER_POSITIONS_G}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
        </div>
        <div className={s.reserve}>
          <TeamLineForReserve
            teams={this.props.teams}
            myTeam={this.props.myTeam}
            reserve={squad.reserve}
            budgetPerPlayer={this.props.budgetPerPlayer}
            filterByPosition={this.props.filterByPosition}
            swapPlayersMyTeam={this.props.swapPlayersMyTeam}
            removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
            openTeamPlayerStats={this.props.openTeamPlayerStats}
          />
        </div>
      </section>
    );
  }
}

export default DragDropContext(HTML5Backend)(withStyles(s)(TeamBuilderField));
