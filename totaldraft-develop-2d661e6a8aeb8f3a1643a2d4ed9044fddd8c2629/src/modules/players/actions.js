import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../../utils';
import * as actions from './actionTypes';
import { statsApiUrl } from '../../config';

/*
 * FETCH PLAYERS BY TOURNAMENT
 */

const requestPlayers = () => ({
  type: actions.REQUEST_PLAYERS
});

const requestPlayersFailure = (error) => ({
  type: actions.REQUEST_PLAYERS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receivePlayers = (response) => ({
  type: actions.RECEIVE_PLAYERS,
  payload: {
    items: response.data.players
  }
});

export function fetchPlayers(tournamentId) {
  return dispatch => {
    dispatch(requestPlayers());
    return fetch(`${statsApiUrl}/tournaments/${tournamentId}/players`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.error) {
          dispatch(requestPlayersFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        } else {
          dispatch(receivePlayers(response));
        }
        return response;
      })
      .catch(error => {
        dispatch(requestPlayersFailure(error));
      });
  };
}

/*
 * FETCH PLAYERS BY TEAMS
 */

const requestPlayersByTeams = () => ({
  type: actions.REQUEST_PLAYERS_BY_TEAMS
});

const requestPlayersByTeamsFailure = (error) => ({
  type: actions.REQUEST_PLAYERS_BY_TEAMS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receivePlayersByTeams = (response) => ({
  type: actions.RECEIVE_PLAYERS_BY_TEAMS,
  payload: {
    items: response.data.players
  }
});

export function fetchPlayersByTeams(teams) {
  return dispatch => {
    dispatch(requestPlayersByTeams());
    return fetch(`${statsApiUrl}/teams/${teams}/players`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.error) {
          dispatch(requestPlayersByTeamsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        } else {
          dispatch(receivePlayersByTeams(response));
        }
        return response;
      })
      .catch(error => {
        dispatch(requestPlayersByTeamsFailure(error));
      });
  };
}

/*
 * FETCH PLAYERS STATS BY LAST 8 ROUNDS
 */

const requestPlayersStats = () => ({
  type: actions.REQUEST_PLAYERS_STATS
});

const requestPlayersStatsFailure = (error) => ({
  type: actions.REQUEST_PLAYERS_STATS_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receivePlayersStats = (response) => ({
  type: actions.RECEIVE_PLAYERS_STATS,
  payload: {
    players: response
  }
});

export function fetchPlayersStats(rounds) {
  return dispatch => {
    dispatch(requestPlayersStats());

    const roundCounts = 8;
    const minRound = Math.min(...rounds);

    const queryRoundsArr = [];
    for (let i = 1; i <= roundCounts; i++) {
      queryRoundsArr.push(minRound - i);
    }

    return fetch(`${statsApiUrl}/tournaments/null/round/${queryRoundsArr.join(',')}/players`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.error) {
          dispatch(requestPlayersStatsFailure({
            response: {
              status: 403,
              statusText: response.data.error
            }
          }));
        } else {
          const { players } = response.data;
          const playersStats = [];

          players.forEach(player => {
            if (playersStats[player.player_id] === undefined) {
              playersStats[player.player_id] = [];
            }
            playersStats[player.player_id][player.round_id] = {
              round_id: player.round_id,
              score: player.score,
              minutes: player.minutes,
              assists: player.assists,
              cards_yellow: player.cards_yellow,
              cards_red: player.cards_red,
              goals_scored: player.goals_scored,
              goals_conceded: player.goals_conceded,
              goals_own: player.goals_own
            };
          });

          dispatch(receivePlayersStats(playersStats));
        }
      })
      .catch(error => {
        dispatch(requestPlayersStatsFailure(error));
      });
  };
}
