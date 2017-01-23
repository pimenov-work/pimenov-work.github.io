import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON, APIErrorMatcher,
  getApplicationMessage } from '../../utils';
import * as actions from './actionTypes';
import { endpointApiAddDeposit, endpointApiGetWithdrawalRequests,
         endpointApiWithdrawalRequest, APP_MESSAGES } from '../../config';
import appstate from 'modules/appstate';

/*
 * FILTER PAYMENT SECTIONS
 */

export const setPaymentVisibilityFilter = (filter) => ({
  type: actions.SET_PAYMENT_VISIBILITY_FILTER,
  payload: { filter }
});

/*
 * ADD CASH DEPOSIT
 */

export const paymentRequest = () => ({
  type: actions.PAYMENT_REQUEST
});

export const paymentFailure = (error) => ({
  type: actions.PAYMENT_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const paymentReceive = (data) => ({
  type: actions.PAYMENT_RECEIVE,
  payload: {
    user: data.user
  }
});

export function addDeposit(money, token) {
  return (dispatch) => {
    dispatch(paymentRequest());

    return fetch(endpointApiAddDeposit, {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${token}`, // eslint-disable-line quote-props
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `money=${money}`
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(paymentFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
        let msg = APIErrorMatcher(response.data.error);
        dispatch(appstate.actions.showGlobalNotification(msg, true));
      } else {
        dispatch(paymentReceive(response.data));
        let msg = getApplicationMessage(APP_MESSAGES.ADD_FUNDS_SUCCESS);
        dispatch(appstate.actions.showGlobalNotification(msg));
      }
      return response;
    })
    .catch(error => {
      if (error.response.status === 401) {
        dispatch(paymentFailure(error));
      }
    });
  };
}

/*
 * GET CASH
 */

export const withdrawalFundsRequest = () => ({
  type: actions.WITHDRAWAL_FUNDS_REQUEST
});

export const withdrawalFundsFailure = (error) => ({
  type: actions.WITHDRAWAL_FUNDS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const withdrawalFundsReceive = (data) => ({
  type: actions.WITHDRAWAL_FUNDS_RECEIVE,
  payload: { data }
});

export function withdrawalFundsProccess(money, email, token) {
  return (dispatch) => {
    dispatch(withdrawalFundsRequest());

    return fetch(endpointApiWithdrawalRequest, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `money=${money}&paypal=${email}`
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(withdrawalFundsFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
        const msg = getApplicationMessage(APP_MESSAGES.WITHDRAWAL_FUNDS_FAILURE);
        dispatch(appstate.actions.showGlobalNotification(msg, true));
      } else {
        dispatch(withdrawalFundsReceive(response.data));
        const msg = getApplicationMessage(APP_MESSAGES.WITHDRAWAL_FUNDS_SUCCESS);
        dispatch(appstate.actions.showGlobalNotification(msg));
      }
      return response;
    })
    .catch(error => {
      if (error.response.status === 401) {
        dispatch(withdrawalFundsFailure(error));
      }
    });
  };
}

 /*
  * GET TRANSACTION HISTORY
  */

export const transactionHistoryRequest = () => ({
  type: actions.TRANSACTION_HISTORY_REQUEST
});

export const transactionHistoryFailure = (error) => ({
  type: actions.TRANSACTION_HISTORY_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const transactionHistoryReceive = (data) => ({
  type: actions.TRANSACTION_HISTORY_RECEIVE,
  payload: {
    payments: data.payments
  }
});

export function getWithdrawalRequests(token) {
  return (dispatch) => {
    dispatch(transactionHistoryRequest());

    return fetch(endpointApiGetWithdrawalRequests, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(transactionHistoryFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
      } else {
        dispatch(transactionHistoryReceive(response.data));
      }
      return response;
    })
    .catch(error => {
      if (error.response.status === 401) {
        dispatch(transactionHistoryFailure(error));
      }
    });
  };
}
