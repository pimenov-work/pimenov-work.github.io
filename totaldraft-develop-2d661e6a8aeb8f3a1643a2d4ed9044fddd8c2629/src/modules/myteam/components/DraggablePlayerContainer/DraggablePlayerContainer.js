import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DropTarget } from 'react-dnd';
import ReactDOM from 'react-dom';
import appstateModule from 'modules/appstate';
import intlModule from 'modules/intl';
import DraggablePlayer from '../DraggablePlayer';

const target = {
  canDrop(props, monitor) {
    if (props.player) {
      return props.player.pos === monitor.getItem().player.pos;
    }
    return false;
  },
  drop(props, monitor) {
    props.swapPlayersMyTeam(props.player, monitor.getItem().player);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class DraggablePlayerContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    teams: PropTypes.array.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    canDrop: PropTypes.bool.isRequired,
    player: PropTypes.object.isRequired,
    filterByPosition: PropTypes.func.isRequired,
    swapPlayersMyTeam: PropTypes.func.isRequired,
    removePlayerFromMyTeam: PropTypes.func.isRequired,
    openTeamPlayerStats: PropTypes.func.isRequired,
    budgetPerPlayer: PropTypes.string,
    currentLocale: PropTypes.string.isRequired,
  };

  render() {
    const { dispatch } = this.props;

    return (
      <DraggablePlayer
        teams={this.props.teams}
        ref={instance => this.props.connectDropTarget(ReactDOM.findDOMNode(instance))}
        canDrop={this.props.canDrop}
        player={this.props.player}
        currentLocale={this.props.currentLocale}
        budgetPerPlayer={this.props.budgetPerPlayer}
        isReservePlayer={this.props.isReservePlayer}
        filterByPosition={this.props.filterByPosition}
        removePlayerFromMyTeam={this.props.removePlayerFromMyTeam}
        openTeamPlayerStats={this.props.openTeamPlayerStats}
        togglePlayerListOnMobile={(cond) => dispatch(appstateModule.actions.togglePlayerListOnMobile(cond))}
      />
    );
  }
}

export default DropTarget('player', target, collect)(
  connect(
    createStructuredSelector({
      currentLocale: intlModule.selectors.getLocale
    })
  )(DraggablePlayerContainer)
);
