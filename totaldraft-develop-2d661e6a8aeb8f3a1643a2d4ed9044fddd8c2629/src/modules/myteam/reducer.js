import reject from 'lodash/reject';
import { createReducer } from 'utils';
import * as actions from './actionTypes';
import { SORT_DIRECTION_DESC, COLLECT_TEAM_POINTS_COLUMN, PLAYER_POSITIONS_ALL } from './constants';

const initialState = {
  players: [],
  title: '',
  collectTeam: {
    sort: {
      sortDirection: SORT_DIRECTION_DESC,
      sortColumn: COLLECT_TEAM_POINTS_COLUMN
    },
    filter: {
      position: PLAYER_POSITIONS_ALL,
      teams: [],
      name: null
    },
    playersCountInInfiniteGrid: 0,
    playerStats: {
      isFetching: false,
      data: null,
      statusText: null
    },
    comparePlayerStats: {
      isFetching: false,
      data: null,
      statusText: null
    },
    selectedPlayerIndex: null,
    selectedPlayerPosition: null
  },
};

export default createReducer(initialState, {
  [actions.LOAD_PLAYERS]: (state, payload) => ({
    ...state,
    players: payload.players,
    title: payload.title
  }),
  [actions.ADD_PLAYER]: (state, payload) => ({
    ...state,
    players: [
      ...state.players,
      payload.player
    ]
  }),
  [actions.REMOVE_PLAYER]: (state, payload) => {
    const updatedTeam = reject(state.players, p => p.id === payload.player.id);
    return Object.assign({}, state, {
      players: updatedTeam
    });
  },
  [actions.SWAP_PLAYERS]: (state, payload) => {
    const players = state.players.slice();
    if (payload.source.isMain !== payload.dest.isMain) {
      payload.source.isMain = !payload.source.isMain;
      payload.dest.isMain = !payload.dest.isMain;
      players[players.indexOf(payload.source)] = payload.source;
      players[players.indexOf(payload.dest)] = payload.dest;
    }
    return Object.assign({}, state, {
      players
    });
  },
  [actions.CLEAR]: state => {
    const players = state.players;
    players.length = 0;
    return Object.assign({}, state, {
      players
    });
  },
  [actions.APPLY_SORT]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      sort: {
        sortDirection: payload.sortDirection,
        sortColumn: payload.sortColumn
      }
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.FILTER_BY_POSITION]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      filter: {
        position: payload.position,
        teams: state.collectTeam.filter.teams,
        name: state.collectTeam.filter.name
      }
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.FILTER_BY_NAME]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      filter: {
        position: state.collectTeam.filter.position,
        teams: state.collectTeam.filter.teams,
        name: payload.name
      }
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.FILTER_BY_TEAMS]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      filter: {
        position: state.collectTeam.filter.position,
        teams: payload.teams,
        name: state.collectTeam.filter.name
      }
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.LOAD_MORE_ELEMENTS_INTO_INFINITE_PLAYERS_GRID]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      playersCountInInfiniteGrid: payload.count
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.RESET_FILTERS]: (state) => {
    return Object.assign({}, state, {
      collectTeam: initialState.collectTeam
    });
  },
  [actions.UPDATE_SELECTED_PLAYER_INDEX]: (state, payload) => {
    const collectTeamMergeObj = Object.assign({}, state.collectTeam, {
      selectedPlayerIndex: payload.index,
      selectedPlayerPosition: payload.position
    });
    return Object.assign({}, state, {
      collectTeam: collectTeamMergeObj
    });
  },
  [actions.PLAYER_STATS_REQUEST]: (state, payload) => {
    const collectTeamMergeObj = {
      ...state.collectTeam.playerStats,
      isFetching: true
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        playerStats: collectTeamMergeObj
      }
    });
  },
  [actions.PLAYER_STATS_FAILURE]: (state, payload) => {
    const collectTeamMergeObj = {
      ...state.collectTeam.playerStats,
      isFetching: false,
      statusText: `Fetch Player Error: ${payload.status} ${payload.statusText}`
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        playerStats: collectTeamMergeObj
      }
    });
  },
  [actions.PLAYER_STATS_RECEIVE]: (state, payload) => {
    const collectTeamMergeObj = {
      isFetching: false,
      data: {
        aggr: payload.aggr,
        stats: payload.stats
      },
      statusText: 'Player stats received'
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        playerStats: collectTeamMergeObj
      }
    });
  },
  [actions.COMPARE_PLAYER_STATS_REQUEST]: (state, payload) => {
    const collectTeamMergeObj = {
      ...state.collectTeam.comparePlayerStats,
      isFetching: true
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        comparePlayerStats: collectTeamMergeObj
      }
    });
  },
  [actions.COMPARE_PLAYER_STATS_FAILURE]: (state, payload) => {
    const collectTeamMergeObj = {
      ...state.collectTeam.comparePlayerStats,
      isFetching: false,
      statusText: `Fetch Player Error: ${payload.status} ${payload.statusText}`
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        comparePlayerStats: collectTeamMergeObj
      }
    });
  },
  [actions.COMPARE_PLAYER_STATS_RECEIVE]: (state, payload) => {
    const collectTeamMergeObj = {
      isFetching: false,
      data: {
        aggr: payload.aggr,
        stats: payload.stats
      },
      statusText: 'Player stats received'
    };
    return Object.assign({}, state, {
      collectTeam: {
        ...state.collectTeam,
        comparePlayerStats: collectTeamMergeObj
      }
    });
  },
});
