import fetch from 'isomorphic-fetch';
import * as actions from './actionTypes';
import { checkHttpStatus, parseJSON } from '../../utils';
import { endpointApiFetchTournaments } from '../../config';

/*
* FETCH TOURNAMENTS
*/

export const requestTournaments = () => ({
  type: actions.REQUEST_TOURNAMENTS
});

export const requestTournamentsFailure = (error) => ({
  type: actions.REQUEST_TOURNAMENTS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

export const receiveTournaments = (response) => ({
  type: actions.REQUEST_TOURNAMENTS_RECEIVE,
  payload: {
    tournaments: response.data.tournaments
  }
});

export function fetchTournaments() {
  return dispatch => {
    dispatch(requestTournaments());

    return fetch(endpointApiFetchTournaments)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(receiveTournaments(response));
        } else {
          dispatch(requestTournamentsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        }
      })
      .catch(error => {
        dispatch(requestTournamentsFailure(error));
      });
  };
}
