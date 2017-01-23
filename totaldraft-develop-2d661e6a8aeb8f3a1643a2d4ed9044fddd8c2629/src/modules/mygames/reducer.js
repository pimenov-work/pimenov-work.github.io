import { createReducer } from '../../utils';
import * as actions from './actionTypes';
import { MyGamesVisibilityFilters } from './constants';

const initialState = {
  future: {
    rooms: null,
    bids: null,
    isFetching: false,
    statusText: null
  },
  past: {
    rooms: null,
    bids: null,
    isFetching: false,
    statusText: null
  },
  live: {
    rooms: null,
    bids: null,
    isFetching: false,
    statusText: null
  },
  all: {
    rooms: null,
    bids: null,
    isFetching: false,
    statusText: null
  },
  filter: MyGamesVisibilityFilters.SHOW_FUTURE_GAMES
};

export default createReducer(initialState, {
  [actions.GAMES_FUTURE_REQUEST]: (state) => ({
    ...state,
    future: {
      ...state.future,
      isFetching: true
    }
  }),
  [actions.GAMES_FUTURE_FAILURE]: (state, payload) => ({
    ...state,
    future: {
      ...state.future,
      isFetching: false,
      statusText: `Fetching Error: ${payload.status} ${payload.statusText}`
    }
  }),
  [actions.GAMES_FUTURE_RECEIVE]: (state, payload) => ({
    ...state,
    future: {
      isFetching: false,
      rooms: payload.data.rooms,
      bids: payload.data.bids,
      statusText: 'Fetching Success'
    }
  }),
  [actions.GAMES_PAST_REQUEST]: (state) => ({
    ...state,
    past: {
      ...state.past,
      isFetching: true
    }
  }),
  [actions.GAMES_PAST_FAILURE]: (state, payload) => ({
    ...state,
    past: {
      ...state.past,
      isFetching: false,
      statusText: `Fetching Error: ${payload.status} ${payload.statusText}`
    }
  }),
  [actions.GAMES_PAST_RECEIVE]: (state, payload) => ({
    ...state,
    past: {
      isFetching: false,
      rooms: payload.data.rooms,
      bids: payload.data.bids,
      statusText: 'Fetching Success'
    }
  }),
  [actions.GAMES_LIVE_REQUEST]: (state) => ({
    ...state,
    live: {
      ...state.live,
      isFetching: true
    }
  }),
  [actions.GAMES_LIVE_FAILURE]: (state, payload) => ({
    ...state,
    live: {
      ...state.live,
      isFetching: false,
      statusText: `Fetching Error: ${payload.status} ${payload.statusText}`
    }
  }),
  [actions.GAMES_LIVE_RECEIVE]: (state, payload) => ({
    ...state,
    live: {
      isFetching: false,
      rooms: payload.data.rooms,
      bids: payload.data.bids,
      statusText: 'Fetching Success'
    }
  }),
  [actions.SET_MYGAMES_VISIBILITY_FILTER]: (state, payload) => ({
    ...state,
    filter: payload.filter
  }),
  [actions.GAMES_ALL_REQUEST]: (state) => ({
    ...state,
    all: {
      ...state.all,
      isFetching: true
    }
  }),
  [actions.GAMES_ALL_FAILURE]: (state, payload) => ({
    ...state,
    all: {
      ...state.all,
      isFetching: false,
      statusText: `Fetching Error: ${payload.status} ${payload.statusText}`
    }
  }),
  [actions.GAMES_ALL_RECEIVE]: (state, payload) => ({
    ...state,
    all: {
      isFetching: false,
      rooms: payload.data.rooms,
      bids: payload.data.bids,
      statusText: 'Fetching Success'
    }
  })
});
