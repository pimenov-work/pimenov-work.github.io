import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import { NAME, MY_TEAM_SIZE, BID_STATUS_CANCELED } from './constants';

export const getRoomData = state => state[NAME].data;
export const getRoom = state => state[NAME];
export const getRoomPrizes = state => state[NAME].prizes;
export const getTeams = state => state.teams.items; // TODO: Replace it via module selector
export const getBids = state => state[NAME].bids;
export const getRoomStats = state => state[NAME].stats;
export const getRoomSingleBidInfo = state => state[NAME].singleBidInfo.data;
export const getBidsFilterQuery = state => state[NAME].filterBidsQuery;
export const getMyTeam = state => state.myTeam; // TODO: Replace it via module selector
export const getRoomUserbids = state => state[NAME].userbids;

export const getActiveUserbids = createSelector(
  [getRoomUserbids],
  (userbids) => userbids.filter(bid => bid.status !== BID_STATUS_CANCELED)
);

export const filterRoomTeamsSelector = createSelector(
  [getRoomData, getTeams],
  (room, teams) => {
    const result = [];

    room.teams.forEach(teamId => {
      const team = teams.find(t => t.team_id === teamId);
      if (team) {
        result.push(team);
      }
    });

    return sortBy(result, r => -r.points);
  }
);

export const filterRoomMembersSelector = createSelector(
  [getBids, getBidsFilterQuery],
  (bids, filter) => {
    let filteredBids = bids;

    if (filter) {
      const filterQuery = filter.replace(/\s+/g, '');

      filteredBids = filteredBids.filter(bid => {
        let fullName = bid.user;
        let fullTitle = bid.title;
        return (fullName && fullName.toUpperCase().indexOf(filterQuery.toUpperCase()) > -1 || fullTitle && fullTitle.toUpperCase().indexOf(filterQuery.toUpperCase()) > -1);
      });
    }

    return filteredBids;
  }
);

export const getAvailableBudgetSelector = createSelector(
  [getMyTeam, getRoom],
  (myTeam, room) => {
    const budget = room && room.data ? room.data.plr_price_limit : 0;
    return budget - (myTeam.players.reduce((memo, player) => memo + player.price, 0));
  }
);

export const getIsTeamCompleteSelector = createSelector(
  [getMyTeam, getRoom, getAvailableBudgetSelector],
  (myTeam, room, budget) => {
    return budget >= 0 && myTeam.players.length === MY_TEAM_SIZE;
  }
);
