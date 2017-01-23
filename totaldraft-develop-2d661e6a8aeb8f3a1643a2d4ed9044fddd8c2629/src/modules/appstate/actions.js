import * as actions from './actionTypes';
import { checkHttpStatus, parseJSON } from '../../utils';
import { NotificationBarTimeout, endpointApiInitApp } from 'config';

/*
* SHOW/HIDE ROOM INFO
*/

export const showRoomInfo = () => ({
  type: actions.SHOW_ROOM_INFO
});

export const hideRoomInfo = () => ({
  type: actions.HIDE_ROOM_INFO
});

/*
* SET ROOM INFO DATA
*/

export const setRoomInfoData = (room = {}, prizes = [], bids = []) => ({
  type: actions.SET_ROOM_INFO_DATA,
  payload: {
    room,
    prizes,
    bids
  }
});

/*
* SHOW/HIDE LOGIN SCREEN
*/

export const showLoginScreen = () => ({
  type: actions.SHOW_LOGIN
});

export const hideLoginScreen = () => ({
  type: actions.HIDE_LOGIN
});

export const setAuthVisibilityFilter = (filter) => ({
  type: actions.SET_LOGIN_VISIBILITY_FILTER,
  payload: {
    filter
  }
});

/*
* GLOBAL NOTIFICATIONS
*/

const showNotificationBar = () => ({
  type: actions.NOTIFICATION_SHOW
});

const hideNotificationBar = () => ({
  type: actions.NOTIFICATION_HIDE
});

const updateNotificationBar = (data) => ({
  type: actions.NOTIFICATION_UPDATE,
  payload: {
    error: data.error,
    message: data.message ? data.message : ''
  }
});

export function showGlobalNotification(message, error = false) {
  return dispatch => {
    dispatch(updateNotificationBar({ error, message }));
    dispatch(showNotificationBar());
    setTimeout(() => dispatch(hideNotificationBar()), NotificationBarTimeout);
  };
}

/*
* SHOW/HIDE SHEDULE
*/

export const showSchedule = () => ({
  type: actions.SHOW_SCHEDULE
});

export const hideSchedule = () => ({
  type: actions.HIDE_SCHEDULE
});

/*
* SHOW/HIDE NEWS
*/

export const showNews = () => ({
  type: actions.NEWS_SHOW
});

export const hideNews = () => ({
  type: actions.NEWS_HIDE
});

/*
* SHOW/HIDE TOURNAMENTS
*/

export const showTournamentTable = () => ({
  type: actions.TOURNAMENT_TABLE_SHOW
});

export const hideTournamentTable = () => ({
  type: actions.TOURNAMENT_TABLE_HIDE
});

/*
* INIT PROCESS
*/

const initAppRequest = () => ({
  type: actions.INIT_APP_REQUEST
});

const initAppFailure = (error) => ({
  type: actions.INIT_APP_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const initAppReceive = (data) => ({
  type: actions.INIT_APP_RECEIVE,
  payload: {
    ...data
  }
});

export function initAppProcess(clientIP) {
  return (dispatch) => {
    dispatch(initAppRequest());
    return fetch(endpointApiInitApp, {
      headers: { 'X-Real-IP': clientIP }
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(initAppReceive(response.data));
        } else {
          dispatch(initAppFailure({
            response: {
              status: 403,
              statusText: 'Init App Error'
            }
          }));
        }
        return response;
      })
      .catch(error => {
        dispatch(initAppFailure(error));
      });
  };
}

/*
* TOGGLE PLAYERLIST ON MOBILE
*/

export const togglePlayerListOnMobile = (condition) => ({
  type: actions.TOGGLE_PLAYERLIST_ON_MOBILE,
  payload: {
    condition
  }
});
