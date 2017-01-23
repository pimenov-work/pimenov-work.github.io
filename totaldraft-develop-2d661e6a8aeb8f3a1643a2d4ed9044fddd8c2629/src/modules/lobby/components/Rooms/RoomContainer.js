import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getCookie } from 'utils';
import { navigate } from 'routes/actions';
import appstateModule from 'modules/appstate';
import roomModule from 'modules/room';
import intlModule from 'modules/intl';
import tournamentsModule from 'modules/tournaments';
import { ROOM_STATUS_NEW } from 'config';

import Room from './Room';

class RoomContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    room: PropTypes.object,
    user: PropTypes.object,
    tournaments: PropTypes.array,
    currentLocale: PropTypes.string.isRequired,
  };

  onPlayBtnClick(roomId) {
    const { dispatch, room } = this.props;
    const token = getCookie('access_token');

    let roomUrl = room.status !== ROOM_STATUS_NEW ? `/rooms/${roomId}` : `/rooms/${roomId}/teams`;

    // TODO: Rethink this logic later
    if (token) {
      dispatch(roomModule.actions.fetchUserBids(roomId, token))
        .then(response => {
          if (!response.error) {
            const { bids } = response.data;
            if (bids.length < room.bids_per_user && room.status === ROOM_STATUS_NEW) {
              roomUrl = `/rooms/${roomId}/teams`;
            } else {
              roomUrl = `/rooms/${roomId}`;
            }
            dispatch(navigate(roomUrl));
          }
        });
    } else {
      dispatch(navigate(roomUrl));
    }
  }

  openRoomInfo(roomId) {
    const { dispatch } = this.props;

    dispatch(roomModule.actions.fetchRoom(roomId))
      .then(response => {
        if (!response.error) {
          const { room, prizes } = response.data;

          dispatch(roomModule.actions.fetchRoomBids(roomId))
            .then(resp => {
              if (!resp.error) {
                const { bids } = resp.data;
                dispatch(appstateModule.actions.setRoomInfoData(room, prizes, bids));
                dispatch(appstateModule.actions.showRoomInfo());
              }
            });
        }
      });
  }

  render() {
    const { room, user, tournaments, currentLocale } = this.props;
    return (
      <Room
        room={room}
        user={user}
        currentLocale={currentLocale}
        tournaments={tournaments}
        openRoomInfo={(id) => this.openRoomInfo(id)}
        onPlayBtnClick={(id) => this.onPlayBtnClick(id)}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    tournaments: tournamentsModule.selectors.getTournaments,
    currentLocale: intlModule.selectors.getLocale
  }))(RoomContainer);
