import { createReducer } from '../../utils';
import * as actions from './actionTypes';
import { AuthVisibilityFilters } from './constants';

const { SHOW_LOGIN } = AuthVisibilityFilters;

const initialState = {
  isLoginShown: false,
  authVisibilityFilter: SHOW_LOGIN,
  isScheduleShown: true,
  isTournamentTableShown: false,
  isNewsShown: false,
  appStatus: {
    error: false,
    isPanelShown: false,
    message: null
  },
  init: {
    stats: null,
    requisites: null,
    country: null,
    blocked: false,
    statusText: '',
    isFetching: false
  },
  roomInfoPanel: {
    room: null,
    prizes: null,
    bids: null,
    isActive: false
  },
  mobile: {
    isPlayersListActive: false
  },
  sportId: 1
};

export default createReducer(initialState, {
  [actions.SET_ROOM_INFO_DATA]: (state, payload) => ({
    ...state,
    roomInfoPanel: {
      ...state.roomInfoPanel,
      room: payload.room,
      prizes: payload.prizes,
      bids: payload.bids
    }
  }),
  [actions.SHOW_ROOM_INFO]: (state) => ({
    ...state,
    roomInfoPanel: { ...state.roomInfoPanel, isActive: true }
  }),
  [actions.HIDE_ROOM_INFO]: (state) => ({
    ...state,
    roomInfoPanel: { ...state.roomInfoPanel, isActive: false }
  }),
  [actions.INIT_APP_REQUEST]: (state) => ({
    ...state,
    init: {
      ...state.init,
      isFetching: true
    }
  }),
  [actions.INIT_APP_FAILURE]: (state, payload) => ({
    ...state,
    init: {
      ...state.init,
      isFetching: false,
      statusText: `${payload.status} ${payload.statusText}`
    }
  }),
  [actions.INIT_APP_RECEIVE]: (state, payload) => ({
    ...state,
    init: {
      stats: payload.stats,
      requisites: payload.requisites,
      country: payload.country,
      blocked: payload.blocked,
      isFetching: false,
      statusText: 'App initialized'
    }
  }),
  [actions.SHOW_LOGIN]: (state) => ({
    ...state,
    isLoginShown: true
  }),
  [actions.HIDE_LOGIN]: (state) => ({
    ...state,
    isLoginShown: false
  }),
  [actions.SET_LOGIN_VISIBILITY_FILTER]: (state, payload) => ({
    ...state,
    authVisibilityFilter: payload.filter
  }),
  [actions.NOTIFICATION_SHOW]: (state) => ({
    ...state,
    appStatus: { ...state.appStatus, isPanelShown: true }
  }),
  [actions.NOTIFICATION_HIDE]: (state) => ({
    ...state,
    appStatus: { ...state.appStatus, isPanelShown: false }
  }),
  [actions.NOTIFICATION_UPDATE]: (state, payload) => ({
    ...state,
    appStatus: {
      ...state.appStatus,
      error: payload.error,
      message: payload.message
    }
  }),
  [actions.SHOW_SCHEDULE]: (state) => ({
    ...state,
    isScheduleShown: true
  }),
  [actions.HIDE_SCHEDULE]: (state) => ({
    ...state,
    isScheduleShown: false
  }),
  [actions.NEWS_SHOW]: (state) => ({
    ...state,
    isNewsShown: true
  }),
  [actions.NEWS_HIDE]: (state) => ({
    ...state,
    isNewsShown: false
  }),
  [actions.TOURNAMENT_TABLE_SHOW]: (state) => ({
    ...state,
    isTournamentTableShown: true
  }),
  [actions.TOURNAMENT_TABLE_HIDE]: (state) => ({
    ...state,
    isTournamentTableShown: false
  }),
  [actions.TOGGLE_PLAYERLIST_ON_MOBILE]: (state, payload) => ({
    ...state,
    mobile: {
      ...state.mobile,
      isPlayersListActive: payload.condition
    }
  })
});
