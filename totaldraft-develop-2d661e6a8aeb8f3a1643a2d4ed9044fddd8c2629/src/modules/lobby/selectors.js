import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { getLocale } from 'modules/intl/selectors';
import { NAME, LOBBY_PRIZE_COLUMN, LOBBY_FEE_COLUMN, LOBBY_SEATS_COLUMN,
  LOBBY_TITLE_COLUMN, LOBBY_START_DATE_COLUMN, SORT_DIRECTION_DESC } from './constants';
import { ROOM_STATUS_FINISHED } from '../../config';
import { getPropByLocale } from '../../utils';

export const getRooms = state => state[NAME].items;
export const getSortColumn = state => state[NAME].sortColumn;
export const getSortDirection = state => state[NAME].sortDirection;
export const getCurrentLocale = state => getLocale(state);

export const sortRoomsSelector = createSelector(
  [getRooms, getSortColumn, getSortDirection, getCurrentLocale],
  (rooms, sortColumn, sortDirection, currentLocale) => {
    let sortedRooms;

    const filteredRooms = rooms.filter(room => room.status !== ROOM_STATUS_FINISHED);

    switch (sortColumn) {
      case LOBBY_PRIZE_COLUMN:
        sortedRooms = sortBy(filteredRooms, room => room.prize);
        break;
      case LOBBY_FEE_COLUMN:
        sortedRooms = sortBy(filteredRooms, room => room.fee);
        break;
      case LOBBY_SEATS_COLUMN:
        sortedRooms = sortBy(filteredRooms, room => room.users);
        break;
      case LOBBY_TITLE_COLUMN:
        sortedRooms = sortBy(filteredRooms, room => getPropByLocale(room.title, currentLocale));
        break;
      case LOBBY_START_DATE_COLUMN:
        sortedRooms = sortBy(filteredRooms, room => room.start);
        break;
      default:
        sortedRooms = filteredRooms;
    }

    if (sortDirection === SORT_DIRECTION_DESC) {
      sortedRooms.reverse();
    }

    return sortedRooms;
  }
);

export const getSpecialRooms = createSelector(
  [getRooms],
  (rooms) => {
    let res = rooms.filter(room => room.banner && room.status !== ROOM_STATUS_FINISHED);
    return sortBy(res, item => new Date(item.start).getTime());
  }
);
