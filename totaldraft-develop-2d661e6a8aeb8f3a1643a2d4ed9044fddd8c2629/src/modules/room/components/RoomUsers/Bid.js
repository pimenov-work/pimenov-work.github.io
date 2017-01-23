import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './RoomUsers.css';
import { ROOM_STATUS_FINISHED, ROOM_STATUS_NEW } from '../../constants';
import { getCurrencySymbol, getLeaderPositions } from 'utils';

function Bid({ bid, bids, room, user, index, getBidInfo }) {
  return (
    <div
      className={cx(s.user, {
        [s.userIsHighlight]:
          bid.prize > 0 || (room.status !== ROOM_STATUS_NEW && bid.place <= getLeaderPositions(bids.length, room.type) && bid.score > 0),
        [s.userIsLogged]:
          user && user.user_id === bid.user_id })
      }
      onClick={() => getBidInfo(bid.bid_id, bid.user_id)}
    >
      <div className={s.userImages}>
        {room.status === ROOM_STATUS_FINISHED && bid.place === 1 ?
          <img src="/images/gold.svg"/>
        : null}
        {room.status === ROOM_STATUS_FINISHED && bid.place === 2 ?
          <img src="/images/silver.svg"/>
        : null}
        {room.status === ROOM_STATUS_FINISHED && bid.place === 3 ?
          <img src="/images/bronze.svg"/>
        : null}
      </div>
      <div className={s.userPlace}>{room.status !== ROOM_STATUS_NEW ? bid.place : index + 1}</div>
      <div className={s.userName}>{bid.user ? bid.user : '-'}</div>
      <div className={s.userTeam}>
        <div className={s.userTeamTitle}>
          {bid.title}
        </div>
      </div>
      <div className={s.userCounts}>{bid.score}</div>
      <div className={s.userPrize}>{bid.prize ? `${bid.prize} ${getCurrencySymbol(room.currency)}` : 0}</div>
    </div>
  );
}

Bid.propTypes = {
  bid: PropTypes.object.isRequired,
  bids: PropTypes.array.isRequired,
  room: PropTypes.object.isRequired,
  user: PropTypes.object,
  index: PropTypes.number,
  getBidInfo: PropTypes.func.isRequired,
};

export default withStyles(s)(Bid);
