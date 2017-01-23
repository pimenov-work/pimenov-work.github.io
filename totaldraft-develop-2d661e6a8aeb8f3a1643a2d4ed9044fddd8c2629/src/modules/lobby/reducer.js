import { createReducer } from '../../utils';
import * as actions from './actionTypes';
import { LOBBY_START_DATE_COLUMN, SORT_DIRECTION_ASC } from './constants';

const initialState = {
  items: [],
  isFetching: false,
  statusText: null,
  sortDirection: SORT_DIRECTION_ASC,
  sortColumn: LOBBY_START_DATE_COLUMN,
};

export default createReducer(initialState, {
  [actions.REQUEST_ROOMS]: (state) => ({
    ...state,
    isFetching: true,
  }),
  [actions.REQUEST_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetching Rooms Error: ${payload.status} ${payload.statusText}`,
  }),
  [actions.RECEIVE_ROOMS]: (state, payload) => ({
    ...state,
    isFetching: false,
    items: payload.items,
  }),
  [actions.APPLY_SORT]: (state, payload) => ({
    ...state,
    sortDirection: payload.sortDirection,
    sortColumn: payload.sortColumn,
  }),
});
