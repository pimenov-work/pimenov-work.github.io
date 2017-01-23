import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RoomInfoPanel from './RoomInfoPanel';
import appstate from 'modules/appstate';
import tournaments from 'modules/tournaments';
import intlModule from 'modules/intl';

const tabs = {
  Rules: 'Rules',
  Prize: 'Prize',
  Members: 'Members',
  Score: 'Score'
};

class RoomInfoContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    panelData: PropTypes.object.isRequired,
    isRoom: PropTypes.bool,
    tournaments: PropTypes.array,
    currentLocale: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isRulesTabShown: true,
      isPrizeTabShown: false,
      isMembersTabShown: false,
      isScoreTabShown: false
    };
  }

  toggleTabs(tabId) {
    this.setState({ isRulesTabShown: (tabId === tabs.Rules),
                    isPrizeTabShown: (tabId === tabs.Prize),
                    isMembersTabShown: (tabId === tabs.Members),
                    isScoreTabShown: (tabId === tabs.Score) });
  }

  closePanel() {
    const { dispatch } = this.props;
    dispatch(appstate.actions.hideRoomInfo());
  }

  render() {
    const { panelData, isRoom, currentLocale } = this.props;
    const { room, prizes, bids, isActive } = panelData;

    return (
      <RoomInfoPanel
        room={room}
        tournaments={this.props.tournaments}
        bids={bids}
        prizes={prizes}
        isRoom={isRoom}
        isActive={isActive}
        currentLocale={currentLocale}
        panelState={{ ...this.state }}
        tabs={tabs}
        toggleTabs={(tabId) => this.toggleTabs(tabId)}
        closePanel={() => this.closePanel()}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    panelData: appstate.selectors.getRoomInfoData,
    tournaments: tournaments.selectors.getTournaments,
    currentLocale: intlModule.selectors.getLocale,
  })
)(RoomInfoContainer);
