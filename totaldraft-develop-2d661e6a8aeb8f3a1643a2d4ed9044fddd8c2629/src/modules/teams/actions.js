import P from 'bluebird';
import * as actions from './actionTypes';
import { statsApiUrl } from '../../config';
import { checkHttpStatus, parseJSON } from '../../utils';

const requestTeams = () => ({
  type: actions.GET_TEAMS_REQUEST
});

const requestTeamsFailure = (error) => ({
  type: actions.GET_TEAMS_REQUEST_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveTeams = (teams) => ({
  type: actions.GET_TEAMS_RECEIVE,
  payload: {
    items: teams
  }
});

export function fetchTeams(tournaments) { // eslint-disable-line
  return dispatch => {
    dispatch(requestTeams());

    // TODO: Replace it with single request (ask for backend support)
    const promises = [];
    tournaments.forEach(id => {
      promises.push(fetch(`${statsApiUrl}/tournaments/${id}/teams`).then(checkHttpStatus).then(parseJSON))
    });

    return P.all(promises)
      .then(response => {
        const allTeams = response.reduce((memo, item) => memo.concat(item.data.teams), []);
        dispatch(receiveTeams(allTeams));
        return allTeams;
      })
      .catch(error => {
        dispatch(requestTeamsFailure(error));
      });
  };
}
