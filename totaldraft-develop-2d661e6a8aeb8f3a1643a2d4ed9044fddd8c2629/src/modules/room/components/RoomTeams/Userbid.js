import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IconSVG from 'components/IconSVG';
import s from './RoomTeams.css';
import { ROOM_STATUS_NEW } from '../../constants';
import { getLeaderPositions } from 'utils';

function Userbid({ bid, bids, room, openTeamDetails, editTeam }) {
  const userBidClassName = cx(s.team, {
    [s.roomIsActive]: room && room.status === ROOM_STATUS_NEW,
    [s.bidIsHighlighted]: (bid.prize > 0 || (room.status !== ROOM_STATUS_NEW && bid.place <= getLeaderPositions(bids.length, room.type) && bid.score > 0))
  });

  return (
    <div className={userBidClassName} onClick={() => openTeamDetails()}>
      <div className={s.tableItemTitle} title={bid.title}>
        <span>{bid.title}</span>
      </div>
      <div className={s.tableItemPrice}>
        {room.fee ? room.fee + ' ₽' : '0 ₽'}
      </div>
      <div className={s.tableItemPoints}>
        {bid.score}
      </div>
      <div className={s.tableItemPlace}>
        {bid.place}
      </div>
      <div className={s.tableItemControls}>
        {room && room.status === ROOM_STATUS_NEW ?
          <div
            data-gtm="edit-team"
            className={s.teamBtn}
            onClick={(e) => {
              e.stopPropagation();
              editTeam();
            }}
          >
            <IconSVG icon="edit-icon" size="17" gtmEvent="edit-team" />
          </div>
        : null}
      </div>
    </div>
  );
}

Userbid.propTypes = {
  bid: PropTypes.object,
  room: PropTypes.object,
  openTeamDetails: PropTypes.func,
  editTeam: PropTypes.func,
};

export default withStyles(s)(Userbid);
