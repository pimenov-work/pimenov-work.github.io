import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { defineMessages, FormattedMessage } from 'react-intl';
import s from './Rooms.css';
import IconSVG from 'components/IconSVG';
import { SORT_DIRECTION_ASC, LOBBY_TITLE_COLUMN, LOBBY_TOURNAMENT_COLUMN,
  LOBBY_TYPE_COLUMN, LOBBY_PRIZE_COLUMN, LOBBY_FEE_COLUMN, LOBBY_SEATS_COLUMN,
  LOBBY_START_DATE_COLUMN } from '../../constants';
import RoomContainer from './RoomContainer';

const messages = defineMessages({
  lobbyRooms: {
    id: 'lobby.rooms',
    defaultMessage: 'Открытые комнаты',
    description: 'Открытые комнаты',
  },
  lobbyGuarantedPrize: {
    id: 'lobby.gruarantedPrize',
    defaultMessage: 'гарантированый приз',
    description: 'гарантированый приз',
  },
  lobbyMinimalGuarantedPrize: {
    id: 'lobby.minimalGruarantedPrize',
    defaultMessage: 'минимальный гарантированый приз',
    description: 'минимальный гарантированый приз',
  },
  lobbyColumnTitle: {
    id: 'lobby.columnTitle',
    defaultMessage: 'Название',
    description: 'Название',
  },
  lobbyColumnWinners: {
    id: 'lobby.columnWinners',
    defaultMessage: 'Побеждают',
    description: 'Побеждают',
  },
  lobbyColumnPrizes: {
    id: 'lobby.columnPrizes',
    defaultMessage: 'Призы',
    description: 'Призы',
  },
  lobbyColumnFee: {
    id: 'lobby.columnFee',
    defaultMessage: 'Взнос',
    description: 'Взнос',
  },
  lobbyColumnParticipants: {
    id: 'lobby.columnParticipants',
    defaultMessage: 'Участники',
    description: 'Участники',
  },
  lobbyColumnStart: {
    id: 'lobby.columnStart',
    defaultMessage: 'Начало',
    description: 'Начало',
  }
});

function RoomList({ user, sortedRooms, sortColumn, sortDirection, applySortForColumn, currentLocale }) {
  const getHeaderElementsCls = (sortDir, sortCol) => {
    const sortDirectionClass = (sortDir === SORT_DIRECTION_ASC) ? s.sortAsc : s.sortDesc;
    return {
      tableHeaderItemTitle: cx(s.tableHeaderItemTitle, (sortCol === LOBBY_TITLE_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemTournament: cx(s.tableHeaderItemTournament, (sortCol === LOBBY_TOURNAMENT_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemType: cx(s.tableHeaderItemType, (sortCol === LOBBY_TYPE_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemPrize: cx(s.tableHeaderItemPrize, (sortCol === LOBBY_PRIZE_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemFee: cx(s.tableHeaderItemFee, (sortCol === LOBBY_FEE_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemSeats: cx(s.tableHeaderItemSeats, (sortCol === LOBBY_SEATS_COLUMN) ? sortDirectionClass : null),
      tableHeaderItemStart: cx(s.tableHeaderItemStart, (sortCol === LOBBY_START_DATE_COLUMN) ? sortDirectionClass : null)
    };
  };

  const headerCls = getHeaderElementsCls(sortDirection, sortColumn);
  const locale = currentLocale.substring(0, 2);
  let mainBackground = { backgroundImage: `url('/images/lobby-back_${locale}.svg')` };
  if (sortedRooms && sortedRooms.length === 0) {
    mainBackground = { backgroundImage: `url('/images/no-tournament_${locale}.svg')` };
  }

  return (
    <section className={s.root}>
      <header className={s.header}>
        <div className={s.title}>
          <FormattedMessage {...messages.lobbyRooms} />
          <div className={s.roomIconsHistory}>
            <IconSVG icon="lock-close-icon" size="14" cssClass={s.titleIcon} /> -
            &nbsp;
            <FormattedMessage {...messages.lobbyGuarantedPrize} />
          </div>
          <div className={s.roomIconsHistory}>
            <IconSVG icon="lock-open-icon" size="14" cssClass={s.titleIcon} /> -
            &nbsp;
            <FormattedMessage {...messages.lobbyMinimalGuarantedPrize} />
          </div>
        </div>
        <div className={s.tableHeader}>
          <div className={s.tableHeaderItemSpecial}></div>
          <div className={headerCls.tableHeaderItemTitle} onClick={() => applySortForColumn(LOBBY_TITLE_COLUMN)}><FormattedMessage {...messages.lobbyColumnTitle} /></div>
          <div className={headerCls.tableHeaderItemType} onClick={() => applySortForColumn(LOBBY_TYPE_COLUMN)}><FormattedMessage {...messages.lobbyColumnWinners} /></div>
          <div className={headerCls.tableHeaderItemPrize} onClick={() => applySortForColumn(LOBBY_PRIZE_COLUMN)}><FormattedMessage {...messages.lobbyColumnPrizes} /></div>
          <div className={headerCls.tableHeaderItemFee} onClick={() => applySortForColumn(LOBBY_FEE_COLUMN)}><FormattedMessage {...messages.lobbyColumnFee} /></div>
          <div className={headerCls.tableHeaderItemSeats} onClick={() => applySortForColumn(LOBBY_SEATS_COLUMN)}><FormattedMessage {...messages.lobbyColumnParticipants} /></div>
          <div className={headerCls.tableHeaderItemStart} onClick={() => applySortForColumn(LOBBY_START_DATE_COLUMN)}><FormattedMessage {...messages.lobbyColumnStart} /></div>
          <div className={s.tableHeaderItemControls}></div>
        </div>
      </header>
      <div className={s.table}>
        {sortedRooms.map(r => <RoomContainer room={r} user={user} key={r.room_id} />)}
      </div>
      <div className={s.background} style={mainBackground}></div>
    </section>
  );
}

RoomList.propTypes = {
  user: PropTypes.object,
  sortedRooms: PropTypes.array,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  applySortForColumn: PropTypes.func,
  currentLocale: PropTypes.string.isRequired
};

export default withStyles(s)(RoomList);
