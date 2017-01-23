import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FutureRoom.css';
import Link from 'components/Link';
import { getCurrencySymbol, getPropByLocale } from 'utils';
import messages from './messages';

function FutureRoom({ room, bid, currentLocale }) {
  return (
    <div className={s.room}>
      <div className={s.roomTitle}>
        {getPropByLocale(room.title, currentLocale)}
      </div>
      <div className={s.roomPrice}>{`${room.prize} ${getCurrencySymbol(room.currency)}`}</div>
      <div className={s.roomFee}>{room.fee > 0 ? `${room.fee} ${getCurrencySymbol(room.currency)}` : <FormattedMessage {...messages.feeFreeLabel} />}</div>
      <div className={s.roomPosition}>{bid && room.limit ? `${room.users} / ${room.limit}` : room.users}</div>
      <div className={s.roomTime}>
        {room.freeze ?
          <FormattedRelative value={new Date(room.freeze)} />
        : '-'}
      </div>
      <div className={s.roomControls}>
        <Link className={s.roomButton} to={`/rooms/${room.room_id}`}>
          <FormattedMessage {...messages.roomLabel} />
        </Link>
      </div>
    </div>
  );
}

FutureRoom.propTypes = {
  room: PropTypes.object.isRequired,
  bid: PropTypes.object.isRequired,
  currentLocale: PropTypes.string.isRequired,
};

export default withStyles(s)(FutureRoom);
