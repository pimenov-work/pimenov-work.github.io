import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import cx from 'classnames';
import IconSVG from 'components/IconSVG'; // eslint-disable-line import/no-unresolved
import Link from 'components/Link'; // eslint-disable-line import/no-unresolved
import s from './SpecialRooms.css';
import { lobbyApiUrl } from 'config';
import { getPropByLocale, getCurrencySymbol } from 'utils';
import messages from './messages';

class SpecialRooms extends Component {

  static propTypes = {
    rooms: PropTypes.array.isRequired,
    user: PropTypes.object,
    currentLocale: PropTypes.string.isRequired,
  };

  render() {
    const { user, currentLocale } = this.props;
    const userBudget = user ? user.money : 0;

    const mainBackground = { backgroundImage: `url('/images/prizes_${currentLocale.substring(0, 2)}.svg')` };

    return (
      <section className={s.root}>
        <header className={s.header}>
          <div className={s.headerTitle}>
            <FormattedMessage {...messages.lobbySpecialRooms} />
          </div>
          <div className={s.headerShapes}>
            <img src="/images/star-white.svg" role="presentation" />
            <img src="/images/star-white.svg" role="presentation" />
            <img src="/images/star-white.svg" role="presentation" />
            <img src="/images/star-white.svg" role="presentation" />
            <img src="/images/star-white.svg" role="presentation" />
          </div>
        </header>
        <div className={s.rooms}>
          {this.props.rooms.map(room =>
            <Link
              data-gtm="special-room"
              className={cx(s.room, { [s.isDisabled]: (user && userBudget - room.fee < 0) || room.users_limit - room.users <= 0 })}
              key={room.room_id}
              to={`/rooms/${room.room_id}`}
              style={{ backgroundImage: `url(${lobbyApiUrl}${decodeURIComponent(room.banner)})` }}
            >
              <div className={s.roomTitle}>{getPropByLocale(room.title, currentLocale)}</div>
              <div className={s.roomPrize}>
                <IconSVG size="16" icon="cup-icon" cssClass={s.prizeIcon} /> {`${room.prize} ${getCurrencySymbol(room.currency)}`}
              </div>
              <div className={s.disableMessage}>
              {userBudget - room.fee < 0 ?
                <FormattedMessage {...messages.roomIsExpensive} />
                :
                <FormattedMessage {...messages.roomIsFull} />
              }
              </div>
              <div className={s.roomDate}>
                <IconSVG size="14" icon="clock-icon" cssClass={s.startIcon} />
                {room && room.freeze ?
                  <FormattedRelative value={new Date(room.freeze)} />
                : '' }
              </div>
            </Link>
          )}
        </div>
        <div className={s.background} style={mainBackground}></div>
      </section>
    );
  }
}

export default withStyles(s)(SpecialRooms);
