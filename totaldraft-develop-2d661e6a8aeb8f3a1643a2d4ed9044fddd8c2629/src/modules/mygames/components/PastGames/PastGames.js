import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import sortBy from 'lodash/sortBy';
import cx from 'classnames';
import s from './PastGames.css';
import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import { getCurrencySymbol, getRoomType, getPropByLocale } from '../../../../utils';
import { BID_STATUS_CANCELED, statsApiUrl } from '../../../../config';
import messages from './messages';

function PastGames({ rooms, bids, tournaments, prizes, currentLocale }) {

  const getTournamentLogo = (tournamentId) => {
    const tourWithLogo = tournaments.find(tour => tour.tournament_id === tournamentId);
    return tourWithLogo ? tourWithLogo.logo : null;
  };

  let updatedRooms = rooms.map(room => {
    room.bids = bids.filter(bid => bid.room_id === room.room_id && bid.status !== BID_STATUS_CANCELED);
    return room;
  });

  updatedRooms = sortBy(updatedRooms, t => t.end).reverse();

  const winnerBids = [];
  if (prizes && prizes.length > 0) {
    prizes.forEach(p => {
      winnerBids.push(p.bid_id);
    });
  }

  // TODO: Sort rooms by start time
  const isTournaments = tournaments.length > 0;

  return (
    <section className={s.root}>
      {updatedRooms.length > 0 ?
        updatedRooms.map(room => {
          return (
            <div className={s.room} key={room.room_id}>
              <header className={s.header}>
                <div className={s.titleLogoContainer}>
                  { isTournaments && getTournamentLogo(room.tournaments[0]) ?
                    <div className={s.tourLogo} style={{ backgroundImage: `url('${statsApiUrl}${getTournamentLogo(room.tournaments[0])}')` }}></div>
                    : null
                  }
                  <div className={s.title}>
                    {getPropByLocale(room.title, currentLocale)}
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
                    <span>{room && room.fee ? `${room.fee} ${getCurrencySymbol(room.currency)}` : <FormattedMessage {...messages.feeFreeLabel} />}</span>
                  </div>
                  <div className={s.headerDetail}>
                    <IconSVG size="16" icon="gift-icon" cssClass={s.headerDetailIcon} />
                    <span>{room ? `${room.prize} ${getCurrencySymbol(room.currency)}` : '-'}</span>
                  </div>
                  <div className={s.headerDetail}>
                    <IconSVG size="16" icon="user2-icon" cssClass={s.headerDetailIcon} />
                    <span>{room ? room.users : '0'}</span>
                  </div>
                  <div className={s.headerDetail}><FormattedMessage {...messages.winsLabel} />: {room ? getRoomType(room.type) : ''}</div>
                  <Link to={`/rooms/${room.room_id}`} className={s.roomButton}>
                    <FormattedMessage {...messages.roomLabel} />
                  </Link>
                </div>
              </header>
              <div className={s.table}>
                <header className={s.tableHeader}>
                  <div className={s.tableHeaderShapes}></div>
                  <div className={s.tableHeaderTeam}>
                    <FormattedMessage {...messages.tableTeamLabel} />
                  </div>
                  <div className={s.tableHeaderCounts}>
                    <FormattedMessage {...messages.tablePointsLabel} />
                  </div>
                  <div className={s.tableHeaderPosition}>
                    <FormattedMessage {...messages.tablePosLabel} />
                  </div>
                  <div className={s.tableHeaderPrize}>
                    <FormattedMessage {...messages.tablePrizeLabel} />
                  </div>
                </header>
                <div className={s.bids}>
                  {room.bids ?
                    room.bids.map(bid =>
                      <div className={cx(s.bid, { [s.bidIsWon]: bid.prize > 0 })} key={bid.bid_id}>
                        <div className={s.bidShapes}>
                          {winnerBids.length > 0 && winnerBids.indexOf(bid.bid_id) > -1 ?
                            <div className={s.winnerPin}></div>
                          : null}
                        </div>
                        <div className={s.bidTeam}>{bid.title}</div>
                        <div className={s.bidCounts}>{bid.score}</div>
                        <div className={s.bidPosition}>{`${bid.place} / ${room.users}`}</div>
                        <div className={s.bidPrize}>{bid.prize ? `${bid.prize} ${getCurrencySymbol(room.currency)}` : 0}</div>
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

PastGames.propTypes = {
  rooms: PropTypes.array.isRequired,
  bids: PropTypes.array.isRequired,
  tournaments: PropTypes.array.isRequired,
  prizes: PropTypes.array.isRequired,
  currentLocale: PropTypes.string.isRequired,
};

export default withStyles(s)(PastGames);
