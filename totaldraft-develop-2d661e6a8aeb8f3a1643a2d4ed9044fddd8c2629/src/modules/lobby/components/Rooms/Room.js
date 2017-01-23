import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { defineMessages, FormattedMessage, FormattedRelative } from 'react-intl';
import cx from 'classnames';
import s from './Rooms.css';
import Link from 'components/Link';
import IconSVG from 'components/IconSVG';
import { getCurrencySymbol, getRoomType, getPropByLocale } from 'utils';
import { ROOM_STATUS_FREEZE, statsApiUrl } from 'config';

const messages = defineMessages({
  playLabel: {
    id: 'lobby.roomPlayLabel',
    defaultMessage: 'Играть',
    description: 'Играть',
  },
  enterLabel: {
    id: 'lobby.roomEnterLabel',
    defaultMessage: 'Войти',
    description: 'Войти',
  },
  freeRoom: {
    id: 'lobby.freeRoom',
    defaultMessage: 'Без взноса',
    description: 'Без взноса',
  },
  roomIsFull: {
    id: 'lobby.roomIsFull',
    defaultMessage: 'Комната заполнена',
    description: 'Комната заполнена',
  },
  roomIsExpensive: {
    id: 'lobby.roomIsExpensive',
    defaultMessage: 'Недостаточно средств для игры',
    description: 'Недостаточно средств для игры',
  },
});

function Room({ room, user, currentLocale, tournaments, openRoomInfo, onPlayBtnClick }) {
  const userBudget = user ? user.money : 0;

  const getTournamentLogo = (tournamentId) => {
    const tourWithLogo = tournaments.find(tour => tour.tournament_id === tournamentId);
    return tourWithLogo ? tourWithLogo.logo : null;
  };

  const logo = getTournamentLogo(room.tournaments[0]);
  const logoStyles = logo ? { backgroundImage: `url('${statsApiUrl}${logo}')` } : {};

  return (
    <Link
      data-gtm="room"
      className={cx(s.row, {
        [s.isDisabled]: (user && userBudget - room.fee < 0) || (room.users_limit && room.users_limit - room.users <= 0),
        [s.isLive]: room.status === ROOM_STATUS_FREEZE
      })}
      to={`/rooms/${room.room_id}`}
    >
      <div className={s.rowItemSpecial}></div>
      <div className={s.rowItemTitle}>
        <div className={s.rowItemTitleCaption}>
          <div className={s.tournamentLogo} style={logoStyles}></div>
          {getPropByLocale(room.title, currentLocale)}
        </div>
        <div
          className={s.infoIcon}
          onClick={e => {
            e.preventDefault();
            openRoomInfo(room.room_id);
          }}
        >
          <IconSVG size="14" icon="info-light-icon" />
        </div>
      </div>
      <div className={s.rowItemType}>{getRoomType(room.type)}</div>
      <div className={s.rowItemPrize}>
        <div className={s.rowItemPrizeValue}>
          {room.prize} {getCurrencySymbol(room.currency)}
        </div>
        <div className={s.rowItemPrizeIcon}>
          {room.prize_guaranteed > 0 ?
            <div className={s.rowItemPrizeGuaranteed}>
              {room.fee > 0 && room.prize_guaranteed < room.prize ?
                <IconSVG cssClass={s.icon} icon="lock-open-icon" size="14" />
              :
                <IconSVG cssClass={s.icon} icon="lock-close-icon" size="14" />
              }
            </div>
          : ''}
        </div>
      </div>
      <div className={s.rowItemFee}>
        {room.fee ?
          `${room.fee} ${getCurrencySymbol(room.currency)}`
          : <FormattedMessage {...messages.freeRoom} />
        }
      </div>
      <div className={s.rowItemSeats}>{room ? room.users : null}</div>
      <div className={s.rowItemStart}>
        {room.freeze ?
          <FormattedRelative value={new Date(room.freeze)} />
          : '-'
        }
      </div>
      <div className={s.rowItemControls}>
        <div
          data-gtm="play-lobby"
          className={s.button}
          onClick={(e) => {
            e.preventDefault();
            onPlayBtnClick(room.room_id);
          }}
        >
          {room.status === ROOM_STATUS_FREEZE ?
            <FormattedMessage {...messages.enterLabel} /> : <FormattedMessage {...messages.playLabel} />
          }
        </div>
        <div className={s.disableMessage}>
          {userBudget - room.fee < 0 ?
            <FormattedMessage {...messages.roomIsExpensive} /> : <FormattedMessage {...messages.roomIsFull} />
          }
        </div>
      </div>
    </Link>
  );
}

Room.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.object,
  tournaments: PropTypes.array,
  currentLocale: PropTypes.string.isRequired,
  openRoomInfo: PropTypes.func,
  onPlayBtnClick: PropTypes.func,
};

export default withStyles(s)(Room);
