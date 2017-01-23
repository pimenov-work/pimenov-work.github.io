import * as actions from './actionTypes';
import { checkHttpStatus, parseJSON, getApplicationMessage,
  APIErrorMatcher } from 'utils';
import appstateModule from 'modules/appstate';
import { statsApiUrl, APP_MESSAGES } from 'config';

/*
* SET TEAM
*/

export function loadPlayerMyTeam(players, title) {
  return {
    type: actions.LOAD_PLAYERS,
    payload: {
      players,
      title
    }
  };
}

/*
* APP PLAYER INTO TEAM
*/

export function addPlayerMyTeam(player) {
  return {
    type: actions.ADD_PLAYER,
    payload: {
      player
    }
  };
}

/*
* REMOVE PLAYER FROM TEAM
*/

export function removePlayerMyTeam(player) {
  return {
    type: actions.REMOVE_PLAYER,
    payload: {
      player
    }
  };
}

/*
* SWAP PLAYERS
*/

export function swapPlayersMyTeam(source, dest) {
  return {
    type: actions.SWAP_PLAYERS,
    payload: {
      source,
      dest
    }
  };
}

/*
* CLEAR TEAM
*/

export function clearMyTeam() {
  return {
    type: actions.CLEAR
  };
}

/*
* APPLY SORT
*/

export function applySort(sortDirection, sortColumn) {
  return {
    type: actions.APPLY_SORT,
    payload: {
      sortDirection,
      sortColumn
    }
  };
}

/*
* FILTER PLAYERS BY POSITION
*/

export function filterByPosition(position) {
  return {
    type: actions.FILTER_BY_POSITION,
    payload: {
      position
    }
  };
}

/*
* FILTER PLAYERS BY NAME
*/

export function filterByName(name) {
  return {
    type: actions.FILTER_BY_NAME,
    payload: {
      name
    }
  };
}

/*
* FILTER PLAYERS BY TEAMS
*/

export function filterByTeams(teams) {
  return {
    type: actions.FILTER_BY_TEAMS,
    payload: {
      teams
    }
  };
}

/*
* LOAD PLAYERS IN INFINITE GRID
*/

export function loadMoreElementsIntoInfinitePlayersGrid(count) {
  return {
    type: actions.LOAD_MORE_ELEMENTS_INTO_INFINITE_PLAYERS_GRID,
    payload: {
      count
    }
  };
}

/*
* RESET FILTERS
*/

export function resetCollectTeamFilters() {
  return {
    type: actions.RESET_FILTERS
  };
}

/*
* UPDATE SELECTED PLAYER INDEX
*/

export function updateSelectedPlayerIndex(index, position) {
  return {
    type: actions.UPDATE_SELECTED_PLAYER_INDEX,
    payload: {
      index, position
    }
  };
}


/*
* LOAD PLAYER STATS
*/

export function playerStatsRequest() {
  return {
    type: actions.PLAYER_STATS_REQUEST
  };
}

export function playerStatsFailure(error) {
  return {
    type: actions.PLAYER_STATS_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function receivePlayerStats(response) {
  return {
    type: actions.PLAYER_STATS_RECEIVE,
    payload: {
      aggr: response.data.aggr,
      stats: response.data.stats
    }
  };
}

export function fetchPlayerStats(competitionId, playerId) {
  return dispatch => {
    dispatch(playerStatsRequest());

    return fetch(`${statsApiUrl}/tournaments/${competitionId}/players/${playerId}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.error) {
          dispatch(playerStatsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));

          const errorText = response.data.error === 'INTERNAL' ?
            getApplicationMessage(APP_MESSAGES.PLAYER_STATS_UNAVAILABLE) :
            APIErrorMatcher(response.data.error);

          dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
        } else {
          if (!response.data.aggr) {
            let msg = getApplicationMessage(APP_MESSAGES.PLAYER_STATS_UNAVAILABLE);
            dispatch(appstateModule.actions.showGlobalNotification(msg, true));
          }
          dispatch(receivePlayerStats(response));
        }
        return response;
      })
      .catch(error => {
        dispatch(playerStatsFailure(error));
      });
  };
}

/*
* LOAD COMPARE PLAYER STATS
*/

export function comparePlayerStatsRequest() {
  return {
    type: actions.COMPARE_PLAYER_STATS_REQUEST
  };
}

export function comparePlayerStatsFailure() {
  return {
    type: actions.COMPARE_PLAYER_STATS_FAILURE
  };
}

export function receiveComparePlayerStats(response) {
  return {
    type: actions.COMPARE_PLAYER_STATS_RECEIVE,
    payload: {
      aggr: response.data.aggr,
      stats: response.data.stats
    }
  };
}

export function fetchComparePlayerStats(tournamentId, playerId) {
  return dispatch => {
    dispatch(comparePlayerStatsRequest());

    return fetch(`${statsApiUrl}/tournaments/${tournamentId}/players/${playerId}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.error) {
          dispatch(comparePlayerStatsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        } else {
          if (!response.data.aggr) {
            let msg = getApplicationMessage(APP_MESSAGES.PLAYER_STATS_UNAVAILABLE);
            dispatch(appstateModule.actions.showGlobalNotification(msg, true));
          }
          dispatch(receiveComparePlayerStats(response));
        }

        return response;
      })
      .catch(error => {
        dispatch(comparePlayerStatsFailure(error));
      });
  };
}
