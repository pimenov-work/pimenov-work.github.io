import { createReducer } from '../../utils';
import * as actions from './actionTypes';

const initialState = {
  items: [],
  isFetching: false,
  statusText: ''
};

export default createReducer(initialState, {
  [actions.GET_TEAMS_REQUEST]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.GET_TEAMS_REQUEST_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetching Rooms Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.GET_TEAMS_RECEIVE]: (state, payload) => ({
    isFetching: false,
    items: payload.items,
    statusText: ''
  })
});
