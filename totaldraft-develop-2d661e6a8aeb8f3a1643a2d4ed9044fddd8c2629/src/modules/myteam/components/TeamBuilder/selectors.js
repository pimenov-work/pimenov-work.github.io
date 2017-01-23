import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import union from 'lodash/union';
import { getPropByLocale } from 'utils';
import { getLocale } from 'modules/intl/selectors';
import { PLAYER_POSITIONS_ALL, SORT_DIRECTION_DESC, COLLECT_TEAM_POINTS_COLUMN,
  COLLECT_TEAM_PRICE_COLUMN, COLLECT_TEAM_PLAYER_NAME_COLUMN,
  COLLECT_TEAM_POSITION_COLUMN, COLLECT_TEAM_CLUB_COLUMN, positionsMap } from '../../constants';

const getRoom = state => state.room;
const getRoomData = state => state.room.data;
const getTeams = state => state.teams.items;
const getPlayers = state => state.players.items;
const getRoomTeams = state => state.room.data.teams;
const getMyTeam = state => state.myTeam;
const getTeamBuilderFilter = state => state.myTeam.collectTeam.filter;
const getTeamBuilderSort = state => state.myTeam.collectTeam.sort;
const getCurrentLocale = state => getLocale(state);

export const getAvailableBudgetSelector = createSelector(
  [getMyTeam, getRoom],
  (myTeam, room) => {
    const budget = room && room.data ? room.data.plr_price_limit : 0;
    return budget - (myTeam.players.reduce((memo, player) => memo + player.price, 0));
  }
);

export const filterRoomTeamsSelector = createSelector(
  [getRoomData, getTeams],
  (room, teams) => {
    const result = [];

    room.teams.forEach(teamId => {
      let team = teams.find(t => t.team_id === teamId);
      if (team) {
        result.push(team);
      }
    });

    return sortBy(result, r => -r.points);
  }
);

export const getPlayersByTeamsSelector = createSelector(
  [getPlayers, getRoomTeams],
  (players, teams) => {
    let result = [];

    teams.forEach(teamId => {
      const plrs = players.filter(p => p.team_id === teamId);
      result = union(result, plrs);
    });

    return result;
  }
);

export const filterPlayersSelector = createSelector(
  [getPlayersByTeamsSelector, getTeamBuilderFilter, getTeamBuilderSort, getTeams, getCurrentLocale],
  (players, filter, sort, teams, currentLocale) => {
    // Filtering
    let filteredPlayers = players;

    if (filter.name) {
      const filterName = filter.name.replace(/\s+/g, '');
      filteredPlayers = filteredPlayers.filter(player => {
        let fullName = getPropByLocale(player.i18n, currentLocale);
        return (fullName && fullName.toUpperCase().indexOf(filterName.toUpperCase()) > -1);
      });
    }

    if (filter.position !== PLAYER_POSITIONS_ALL) {
      filteredPlayers = filteredPlayers.filter(player => player.pos === filter.position);
    }

    if (filter.teams.length > 0) {
      filteredPlayers = filteredPlayers.filter(player => filter.teams.some(team => team === player.team_id));
    }

    // Sorting
    let sortedPlayers;
    switch (sort.sortColumn) {
      case COLLECT_TEAM_POINTS_COLUMN:
        sortedPlayers = sortBy(filteredPlayers, p => p.avg === null ? 0 : p.avg);
        break;
      case COLLECT_TEAM_PRICE_COLUMN:
        sortedPlayers = sortBy(filteredPlayers, p => p.price);
        break;
      case COLLECT_TEAM_PLAYER_NAME_COLUMN:
        sortedPlayers = sortBy(filteredPlayers, player => getPropByLocale(player.i18n, currentLocale));
        break;
      case COLLECT_TEAM_POSITION_COLUMN:
        sortedPlayers = sortBy(filteredPlayers, player => positionsMap[player.pos].props.defaultMessage);
        break;
      case COLLECT_TEAM_CLUB_COLUMN:
        sortedPlayers = sortBy(filteredPlayers, player => {
          let p = teams.find(team => team.team_id === player.team_id);
          return getPropByLocale(p.i18n, currentLocale);
        });
        break;
      default:
        sortedPlayers = filteredPlayers;
    }

    if (sort.sortDirection === SORT_DIRECTION_DESC) {
      sortedPlayers.reverse();
    }

    return sortedPlayers;
  }
);
