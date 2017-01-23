import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import sortBy from 'lodash/sortBy';
import cx from 'classnames';
import s from './LiveGames.css';
import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import { getCurrencySymbol, getRoomType, getPropByLocale } from 'utils';
import { BID_STATUS_CANCELED, ROOM_TYPE_FLAT10, ROOM_TYPE_FLAT20,
  ROOM_TYPE_FLAT50, ROOM_TYPE_ALLNOTHING, statsApiUrl } from 'config';
import messages from './messages';

function LiveGames({ rooms, bids, tournaments, currentLocale }) {

  const getTournamentLogo = (tournamentId) => {
    const tourWithLogo = tournaments.find(tour => tour.tournament_id === tournamentId);
    return tourWithLogo ? tourWithLogo.logo : null;
  };

  const getLeaderPositions = (room) => {
    let x = 10;
    switch (room.type) {
      case ROOM_TYPE_FLAT10:
        x = 10;
        break;
      case ROOM_TYPE_FLAT20:
        x = 20;
        break;
      case ROOM_TYPE_FLAT50:
        x = 50;
        break;
      case ROOM_TYPE_ALLNOTHING:
        x = 1;
        break;
      default:
        x = 10;
    }
    return (x !== 1) ? Math.round(room.users / 100 * x) : x;
  };

  let updatedRooms = rooms.map(room => {
    room.bids = bids.filter(bid => bid.room_id === room.room_id && bid.status !== BID_STATUS_CANCELED);
    return room;
  });

  updatedRooms = sortBy(updatedRooms, t => -t.room_id);

  return (
    <section className={s.root}>
      {updatedRooms.length > 0 ?
        updatedRooms.map(room => {
          return (
            <div className={s.room} key={room.room_id}>
              <header className={s.header}>
                <div className={s.titleLogoContainer}>
                  {tournaments && tournaments.length > 0 ?
                    <div className={s.tourLogo} style={{ backgroundImage: `url('${statsApiUrl}${getTournamentLogo(room.tournaments[0])}')` }}></div>
                    : null
                  }
                  <div className={s.title}>
                    {getPropByLocale(room.title, currentLocale)}
                    <span className={s.liveLabel}>live</span>
                  </div>
                </div>
                <div className={s.headerDetails}>
                  {room.freeze ?
                    <div className={s.headerDetail}>
                      <IconSVG size="15" icon="clock-icon" cssClass={s.headerDetailIcon} />
                      <FormattedRelative value={new Date(room.freeze)} />
                    </div>
                  : null}
                  <div className={s.headerDetail}>
                    <IconSVG size="16" icon="fee-icon" cssClass={s.headerDetailIcon} />
                    <span>{room.fee ? `${room.fee} ${getCurrencySymbol(room.currency)}` : <FormattedMessage {...messages.feeFreeLabel} />}</span>
                  </div>
                  <div className={s.headerDetail}>
                    <IconSVG size="16" icon="gift-icon" cssClass={s.headerDetailIcon} />
                    <span>{room.prize ? `${room.prize} ${getCurrencySymbol(room.currency)}` : '-'}</span>
                  </div>
                  <div className={s.headerDetail}>
                    <IconSVG size="16" icon="user2-icon" cssClass={s.headerDetailIcon} />
                    <span>{room.users}</span>
                  </div>
                  <div className={s.headerDetail}><FormattedMessage {...messages.winsLabel} />: {getRoomType(room.type)}</div>
                  <Link to={`/rooms/${room.room_id}`} className={s.roomButton}>
                    <FormattedMessage {...messages.roomLabel} />
                  </Link>
                </div>
              </header>
              <div className={s.table}>
                <header className={s.tableHeader}>
                  <div className={s.tableHeaderTeam}><FormattedMessage {...messages.tableTeamLabel} /></div>
                  <div className={s.tableHeaderCounts}><FormattedMessage {...messages.tablePointsLabel} /></div>
                  <div className={s.tableHeaderPosition}><FormattedMessage {...messages.tablePosLabel} /></div>
                </header>
                <div className={s.bids}>
                  {room.bids ?
                    room.bids.map(bid =>
                      <div className={cx(s.bid, { [s.bidIsWon]: bid.place <= getLeaderPositions(room) })} key={bid.bid_id}>
                        <div className={s.bidTeam}>{bid.title}</div>
                        <div className={s.bidCounts}>{bid.score}</div>
                        <div className={s.bidPosition}>{`${bid.place} / ${room.users}`}</div>
                      </div>
                    )
                  : null}
                </div>
              </div>
            </div>
          );
        })
      :
        <div className={s.note}>
          <div className={s.noteText}>
            <FormattedMessage {...messages.emptyLabel} />
          </div>
          <Link className={s.roomButton} to="/lobby">
            <FormattedMessage {...messages.lobbyLabel} />
          </Link>
        </div>
      }
    </section>
  );
}

LiveGames.propTypes = {
  rooms: PropTypes.array.isRequired,
  bids: PropTypes.array.isRequired,
  tournaments: PropTypes.array.isRequired,
  currentLocale: PropTypes.string.isRequired,
};

export default withStyles(s)(LiveGames);
