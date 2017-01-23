import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON, getCookie, APIErrorMatcher,
  getApplicationMessage } from '../../utils';
import * as actions from './actionTypes';
import { endpointApiFetchRoom, endpointApiFetchRoomBids,
  endpointApiFetchUserBids, statsApiUrl, endpointApiRequestBid,
  lobbyApiUrl, APP_MESSAGES } from '../../config';

import authModule from '../auth';
import appstateModule from '../appstate';

/*
* FETCH ROOM
*/

export const fetchRoomRequest = () => ({
  type: actions.FETCH_REQUEST
});

export const fetchRoomFailure = (error) => ({
  type: actions.FETCH_REQUEST_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const fetchRoomReceive = (response) => ({
  type: actions.FETCH_REQUEST_RECEIVE,
  payload: {
    data: response.data.room,
    prizes: response.data.prizes
  }
});

export function fetchRoom(roomId) {
  return dispatch => {
    dispatch(fetchRoomRequest());

    return fetch(`${endpointApiFetchRoom}/${roomId}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(fetchRoomReceive(response));
        } else {
          dispatch(fetchRoomFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        }

        return response;
      })
      .catch(error => {
        dispatch(fetchRoomFailure(error));
      });
  };
}

/*
* FETCH ROOM BIDS
*/

const requestRoomBids = () => ({
  type: actions.ROOM_BIDS_REQUEST
});

const requestRoomBidsFailure = (error) => ({
  type: actions.ROOM_BIDS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveRoomBids = (response) => ({
  type: actions.ROOM_BIDS_RECEIVE,
  payload: {
    data: response.data.bids
  }
});

export function fetchRoomBids(roomId) {
  return dispatch => {
    dispatch(requestRoomBids());

    return fetch(`${endpointApiFetchRoomBids}/${roomId}/bids`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(receiveRoomBids(response));
        } else {
          dispatch(requestRoomBidsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        }
        return response;
      })
      .catch(error => {
        dispatch(requestRoomBidsFailure(error));
      });
  };
}

/*
* FETCH ROOM USER BIDS
*/

const requestUserBids = () => ({
  type: actions.ROOM_USERBIDS_REQUEST
});

const requestUserBidsFailure = (error) => ({
  type: actions.ROOM_USERBIDS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveUserBids = (response) => ({
  type: actions.ROOM_USERBIDS_RECEIVE,
  payload: {
    data: response.data.bids
  }
});

export function fetchUserBids(roomId, token) {
  return dispatch => {
    dispatch(requestUserBids());

    return fetch(`${endpointApiFetchUserBids}/${roomId}/userbids`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        dispatch(receiveUserBids(response));
      } else {
        dispatch(requestUserBidsFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
      }
      return response;
    })
    .catch(error => {
      dispatch(requestUserBidsFailure(error));
    });
  };
}

/*
* CLEAR ROOM BIDS
*/

export const clearRoomUserbids = () => ({
  type: actions.CLEAR_ROOM_USERBIDS
});

/*
* GET STATS BY MATCHES
*/

const requestStatsByMatches = () => ({
  type: actions.STATS_BY_MATCHES_REQUEST
});

const requestStatsByMatchesFailure = (error) => ({
  type: actions.STATS_BY_MATCHES_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveStatsByMatches = (response) => ({
  type: actions.STATS_BY_MATCHES_RECEIVE,
  payload: {
    data: response.data.players
  }
});

export function fetchStatsByMatches(matches) {
  return dispatch => {
    dispatch(requestStatsByMatches());

    const queryRounds = matches.join(',');

    return fetch(`${statsApiUrl}/matches/${queryRounds}/players`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(receiveStatsByMatches(response));
        } else {
          dispatch(requestStatsByMatchesFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        }
        return response;
      })
      .catch(error => {
        dispatch(requestStatsByMatchesFailure(error));
      });
  };
}

/*
* DELETE BID
*/

const requestBidDelete = () => ({
  type: actions.BID_DELETE_REQUEST
});

const requestBidDeleteFailure = (error) => ({
  type: actions.BID_DELETE_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveBidDelete = () => ({
  type: actions.BID_DELETE_RECEIVE,
  payload: {
    statusText: 'Bid successfully deleted'
  }
});

export function deleteBid(roomId, bidId, token) {
  return dispatch => {
    dispatch(requestBidDelete());
    return fetch(`${endpointApiRequestBid}/${roomId}/bids/${bidId}`, {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        dispatch(receiveBidDelete(response));
        dispatch(fetchRoom(roomId));
        dispatch(fetchUserBids(roomId, token));
        dispatch(fetchRoomBids(roomId));
        dispatch(authModule.actions.fetchUserData(token));
      } else {
        dispatch(requestBidDeleteFailure({
          response: { status: 403, statusText: response.data.error }
        }));
      }
      return response;
    })
    .catch(error => {
      dispatch(requestBidDeleteFailure(error));
    });
  };
}

/*
* GET SINGLE BID
*/
export function getSingleBidRequest() {
  return {
    type: actions.GET_BID_REQUEST
  };
}

export function getSingleBidFailure(error) {
  return {
    type: actions.GET_BID_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function singleBidReceive(response) {
  return {
    type: actions.GET_BID_RECEIVE,
    payload: {
      data: response.data.bid
    }
  };
}

export function getSingleBid(roomId, bidId, token) {
  return dispatch => {
    dispatch(getSingleBidRequest());

    return fetch(`${endpointApiFetchUserBids}/${roomId}/bids/${bidId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        dispatch(singleBidReceive(response));
      } else {
        dispatch(getSingleBidFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
      }
      return response;
    })
    .catch(error => {
      dispatch(getSingleBidFailure(error));
    });
  };
}

/*
* FILTERING BIDS
*/

export function filterRoomBids(query) {
  return {
    type: actions.ROOM_FILTER_BIDS,
    payload: {
      query
    }
  };
}


/*
 * BET REQUEST
 */

export function betRequest() {
  return {
    type: actions.BID_REQUEST
  };
}

export function betReceive(data) {
  return {
    type: actions.BID_RECEIVE,
    payload: {
      bid: data.bid,
      user: data.user
    }
  };
}

export function betFailure(error) {
  return {
    type: actions.BID_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function sendBetRequest(team, teamName, roomId) {
  const token = getCookie('access_token');

  const mainPlayers = team.main;
  const reservePlayers = team.reserve;

  return dispatch => {
    dispatch(betRequest());

    return fetch(`${lobbyApiUrl}/rooms/${roomId}/bids`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `main=${mainPlayers.join()}&reserve=${reservePlayers.join()}&title=${encodeURI(teamName)}`
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(betReceive(response.data));
          dispatch(authModule.actions.fetchUserData(token));
        } else {
          dispatch(betFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));

          const errMsg = response.data.error === 'LIMIT_REACHED' ?
            APIErrorMatcher(response.data.error) :
            getApplicationMessage(APP_MESSAGES.BET_FAILURE);
          dispatch(appstateModule.actions.showGlobalNotification(errMsg, true));
        }

        return response;
      })
      .catch(error => {
        dispatch(betFailure(error));
      });
  };
}

/*
 * BID UPDATE
 */

export function betUpdateRequest() {
  return {
    type: actions.BID_UPDATE_REQUEST
  };
}

export function betUpdateReceive(data) {
  return {
    type: actions.BID_UPDATE_RECEIVE,
    payload: {
      bid: data.bid
    }
  };
}

export function betUpdateFailure(error) {
  return {
    type: actions.BID_UPDATE_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function sendUpdateBetRequest(team, teamName, roomId, teamId) {
  const token = getCookie('access_token');
  const mainPlayers = team.main;
  const reservePlayers = team.reserve;

  return dispatch => {
    dispatch(betUpdateRequest());

    return fetch(`${lobbyApiUrl}/rooms/${roomId}/bids/${teamId}`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `main=${mainPlayers.join()}&reserve=${reservePlayers.join()}&title=${encodeURI(teamName)}`
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(betUpdateReceive(response.data));
        } else {
          dispatch(betUpdateFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));

          const errorText = 'Заявка не обновлена. Ошибка на сервере';

          dispatch(appstateModule.actions.howGlobalNotification(errorText, true));
        }

        return response;
      })
      .catch(error => {
        dispatch(betUpdateFailure(error));
      });
  };
}
