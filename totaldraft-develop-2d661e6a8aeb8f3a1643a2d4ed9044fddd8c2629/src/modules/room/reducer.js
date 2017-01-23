import { createReducer } from '../../utils';
import * as actions from './actionTypes';

const initialState = {
  data: null,
  prizes: [],
  bids: [],
  userbids: [],
  isFetching: false,
  statusText: null,
  requestedBid: null,
  isBidDeleting: false,
  filterBidsQuery: null,
  stats: null,
  singleBidInfo: {
    data: null,
    isFetching: false,
    statusText: null
  }
};

export default createReducer(initialState, {
  [actions.FETCH_REQUEST]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.FETCH_REQUEST_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetching Room Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.FETCH_REQUEST_RECEIVE]: (state, payload) => ({
    ...state,
    isFetching: false,
    data: payload.data,
    prizes: payload.prizes
  }),
  [actions.ROOM_BIDS_REQUEST]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.ROOM_BIDS_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetch Room Bids Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.ROOM_BIDS_RECEIVE]: (state, payload) => ({
    ...state,
    isFetching: false,
    bids: payload.data
  }),
  [actions.ROOM_USERBIDS_REQUEST]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.ROOM_USERBIDS_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetch User Bids Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.ROOM_USERBIDS_RECEIVE]: (state, payload) => ({
    ...state,
    isFetching: false,
    userbids: payload.data
  }),
  [actions.CLEAR_ROOM_USERBIDS]: (state) => ({
    ...state,
    userbids: null
  }),
  [actions.STATS_BY_MATCHES_REQUEST]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.STATS_BY_MATCHES_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetching Stats By Matches Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.STATS_BY_MATCHES_RECEIVE]: (state, payload) => ({
    ...state,
    isFetching: false,
    stats: { players: payload.data }
  }),
  [actions.BID_DELETE_REQUEST]: (state) => ({
    ...state,
    isBidDeleting: true
  }),
  [actions.BID_DELETE_FAILURE]: (state, payload) => ({
    ...state,
    isBidDeleting: false,
    statusText: `Bid Delete Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.BID_DELETE_RECEIVE]: (state, payload) => ({
    ...state,
    isBidDeleting: false,
    statusText: payload.statusText
  }),
  [actions.ROOM_FILTER_BIDS]: (state, payload) => {
    return {
      ...state,
      filterBidsQuery: payload.query
    };
  },
  [actions.GET_BID_REQUEST]: (state) => {
    return Object.assign({}, state, {
      singleBidInfo: {
        ...state.singleBidInfo,
        isFetching: true,
        statusText: 'Fetching single bid'
      }
    });
  },
  [actions.GET_BID_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      singleBidInfo: {
        ...state.singleBidInfo,
        isFetching: false,
        statusText: `Fetching Bid Error: ${payload.status} ${payload.statusText}`
      }
    });
  },
  [actions.GET_BID_RECEIVE]: (state, payload) => {
    return Object.assign({}, state, {
      singleBidInfo: {
        isFetching: false,
        data: payload.data,
        statusText: 'Fetching Bid Success'
      }
    });
  }
});
