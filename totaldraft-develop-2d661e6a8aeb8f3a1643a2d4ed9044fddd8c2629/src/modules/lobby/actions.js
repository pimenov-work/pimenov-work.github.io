import fetch from 'isomorphic-fetch';
import * as actions from './actionTypes';
import { checkHttpStatus, parseJSON } from '../../utils';
import { endpointApiFetchLobbyRooms } from '../../config';

// Use action e.g. lobby.actions.add('Do that thing');

/*
* GET LOBBY ROOMS
*/

export const requestRooms = () => ({
  type: actions.REQUEST_ROOMS,
});

export const requestRoomsFailure = (error) => ({
  type: actions.REQUEST_FAILURE,
  payload: {
    status: error.response ? error.response.status : '403',
    statusText: error.response ? error.response.statusText : 'Неизвестная ошибка',
  },
});

export const receiveRooms = (response) => ({
  type: actions.RECEIVE_ROOMS,
  payload: {
    items: response.data.rooms,
  },
});

export function fetchRooms() {
  return dispatch => {
    dispatch(requestRooms());

    return fetch(endpointApiFetchLobbyRooms)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(receiveRooms(response));
        } else {
          dispatch(requestRoomsFailure({
            response: {
              status: 403,
              statusText: response.data.error,
            },
          }));
        }

        return response;
      })
      .catch(error => {
        dispatch(requestRoomsFailure(error));
      });
  };
}

/*
* SORT LOBBY ROOMS
*/

export const applySort = (sortDirection, sortColumn) => ({
  type: actions.APPLY_SORT,
  payload: {
    sortDirection,
    sortColumn,
  },
});
