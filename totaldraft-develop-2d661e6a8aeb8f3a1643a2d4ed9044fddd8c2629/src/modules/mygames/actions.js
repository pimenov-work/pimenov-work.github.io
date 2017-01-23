import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../../utils';
import * as actions from './actionTypes';
import { GAME_STATUS_NEW,
         GAME_STATUS_FREEZE,
         GAME_STATUS_FINISHED,
         endpointApiFetchMyGames } from '../../config';

/*
* LOAD FUTURE GAMES
*/

export const requestMyGamesFuture = () => ({
  type: actions.GAMES_FUTURE_REQUEST
});

export const requestMyGamesFutureFailure = (error) => ({
  type: actions.GAMES_FUTURE_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const myGamesFutureReceive = (response) => ({
  type: actions.GAMES_FUTURE_RECEIVE,
  payload: {
    data: response.data
  }
});

/*
* LOAD LIVE GAMES
*/

export const requestMyGamesLive = () => ({
  type: actions.GAMES_LIVE_REQUEST
});

export const requestMyGamesLiveFailure = (error) => ({
  type: actions.GAMES_LIVE_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const myGamesLiveReceive = (response) => ({
  type: actions.GAMES_LIVE_RECEIVE,
  payload: {
    data: response.data
  }
});

/*
* LOAD PAST GAMES
*/

export const requestMyGamesPast = () => ({
  type: actions.GAMES_PAST_REQUEST
});

export const requestMyGamesPastFailure = (error) => ({
  type: actions.GAMES_PAST_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const myGamesPastReceive = (response) => ({
  type: actions.GAMES_PAST_RECEIVE,
  payload: {
    data: response.data
  }
});

export const requestMyGamesAll = () => ({
  type: actions.GAMES_ALL_REQUEST
});

export const requestMyGamesAllFailure = (error) => ({
  type: actions.GAMES_ALL_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const myGamesAllReceive = (response) => ({
  type: actions.GAMES_ALL_RECEIVE,
  payload: {
    data: response.data
  }
});

export function fetchMyGames(status, token) {
  return dispatch => {
    switch (status) {
      case GAME_STATUS_NEW:
        dispatch(requestMyGamesFuture());
        break;
      case GAME_STATUS_FREEZE:
        dispatch(requestMyGamesLive());
        break;
      case GAME_STATUS_FINISHED:
        dispatch(requestMyGamesPast());
        break;
      default:
        dispatch(requestMyGamesAll());
    }

    return fetch(`${endpointApiFetchMyGames}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        const error = {
          response: {
            status: 403,
            statusText: response.data.error
          }
        };

        switch (status) {
          case GAME_STATUS_NEW:
            dispatch(requestMyGamesFutureFailure(error));
            break;
          case GAME_STATUS_FREEZE:
            dispatch(requestMyGamesLiveFailure(error));
            break;
          case GAME_STATUS_FINISHED:
            dispatch(requestMyGamesPastFailure(error));
            break;
          default:
            dispatch(requestMyGamesAllFailure(error));
        }
      } else {
        switch (status) {
          case GAME_STATUS_NEW:
            dispatch(myGamesFutureReceive(response));
            break;
          case GAME_STATUS_FREEZE:
            dispatch(myGamesLiveReceive(response));
            break;
          case GAME_STATUS_FINISHED:
            dispatch(myGamesPastReceive(response));
            break;
          default:
            dispatch(myGamesAllReceive(response));
        }
      }
      return response;
    })
    .catch(error => {
      switch (status) {
        case GAME_STATUS_NEW:
          dispatch(requestMyGamesFutureFailure(error));
          break;
        case GAME_STATUS_FREEZE:
          dispatch(requestMyGamesLiveFailure(error));
          break;
        case GAME_STATUS_FINISHED:
          dispatch(requestMyGamesPastFailure(error));
          break;
        default:
          dispatch(requestMyGamesAllFailure(error));
      }
    });
  };
}

/*
* FILTER
*/

export const setMyGamesVisibilityFilter = (filter) => ({
  type: actions.SET_MYGAMES_VISIBILITY_FILTER,
  payload: { filter }
});
