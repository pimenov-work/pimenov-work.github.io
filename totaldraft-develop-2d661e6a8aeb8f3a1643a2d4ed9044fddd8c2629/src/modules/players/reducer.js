import { createReducer } from '../../utils';
import * as actions from './actionTypes';

const initialState = {
  items: [],
  isFetching: false,
  statusText: null,
  stats: {
    players: [],
    isFetching: false,
    statusText: null
  }
};

export default createReducer(initialState, {
  [actions.REQUEST_PLAYERS]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    });
  },
  [actions.REQUEST_PLAYERS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false,
      statusText: `Fetching Players Error: ${payload.status} ${payload.statusText}`
    });
  },
  [actions.RECEIVE_PLAYERS]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: payload.items
    });
  },
  [actions.REQUEST_PLAYERS_BY_TEAMS]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    });
  },
  [actions.REQUEST_PLAYERS_BY_TEAMS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false,
      statusText: `Fetching Players by teams error: ${payload.status} ${payload.statusText}`
    });
  },
  [actions.RECEIVE_PLAYERS_BY_TEAMS]: (state, payload) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: payload.items,
      statusText: 'Fetching Players by teams Success'
    });
  },
  [actions.REQUEST_PLAYERS_STATS]: (state) => {
    return Object.assign({}, state, {
      ...state,
      stats: {
        ...state.stats,
        isFetching: true
      }
    });
  },
  [actions.REQUEST_PLAYERS_STATS_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      ...state,
      stats: {
        ...state.stats,
        isFetching: false,
        statusText: `Fetching Stats Error: ${payload.status} ${payload.statusText}`
      }
    });
  },
  [actions.RECEIVE_PLAYERS_STATS]: (state, payload) => {
    return Object.assign({}, state, {
      ...state,
      stats: {
        isFetching: false,
        statusText: 'Stats Loaded Succesfully',
        players: payload.players
      }
    });
  }
});
