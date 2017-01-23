import { createReducer } from '../../utils';
import * as actions from './actionTypes';
import { PaymentFilters } from './constants';

const initialState = {
  filter: PaymentFilters.SHOW_CASH_OUT,
  history: {
    data: null,
    isFetching: false,
    statusText: null
  }
};

export default createReducer(initialState, {
  [actions.SET_PAYMENT_VISIBILITY_FILTER]: (state, payload) => ({
    ...state,
    filter: payload.filter
  }),
  [actions.TRANSACTION_HISTORY_REQUEST]: (state) => {
    return Object.assign({}, state, {
      ...state,
      history: {
        ...state.history,
        isFetching: true
      }
    });
  },
  [actions.TRANSACTION_HISTORY_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      ...state,
      history: {
        ...state.history,
        isFetching: false,
        statusText: `Fetching Transaction History Error: ${payload.status} ${payload.statusText}`
      }
    });
  },
  [actions.TRANSACTION_HISTORY_RECEIVE]: (state, payload) => {
    return Object.assign({}, state, {
      ...state,
      history: {
        isFetching: false,
        statusText: 'Transaction History Loaded',
        data: payload.payments
      }
    });
  }
});
