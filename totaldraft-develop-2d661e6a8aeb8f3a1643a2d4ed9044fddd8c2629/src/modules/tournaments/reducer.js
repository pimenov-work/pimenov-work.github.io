import { createReducer } from '../../utils';
import * as actions from './actionTypes';

const initialState = {
  items: [],
  isFetching: false,
  statusText: null
};

export default createReducer(initialState, {
  [actions.REQUEST_TOURNAMENTS]: (state) => ({
    ...state,
    isFetching: true
  }),
  [actions.REQUEST_TOURNAMENTS_FAILURE]: (state, payload) => ({
    ...state,
    isFetching: false,
    statusText: `Fetch Tournaments Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.REQUEST_TOURNAMENTS_RECEIVE]: (state, payload) => ({
    ...state,
    isFetching: false,
    items: payload.tournaments
  })
});
