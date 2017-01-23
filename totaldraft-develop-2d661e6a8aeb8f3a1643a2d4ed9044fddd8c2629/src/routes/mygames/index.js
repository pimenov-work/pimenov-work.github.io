import React from 'react';
import uniq from 'lodash/uniq';
import ProtectedPage from 'components/ProtectedPage';
import MyGames from 'modules/mygames/components/MyGames';
import { GAME_STATUS_NEW,
         GAME_STATUS_FREEZE,
         GAME_STATUS_FINISHED } from '../../config';
import authModule from 'modules/auth';
import mygamesModule from 'modules/mygames';
import teamsModule from 'modules/teams';
import playersModule from 'modules/players';

export default {
  path: '/mygames/:page',
  async action({ context, params }) { // eslint-disable-line react/prop-types
    const { store } = context;
    const state = store.getState();
    const user = authModule.selectors.getUser(state);

    if (!user) {
      return <ProtectedPage />;
    }

    const token = context.token;
    let gameStatus;
    switch (params.page) {
      case 'future':
        gameStatus = GAME_STATUS_NEW;
        break;
      case 'live':
        gameStatus = GAME_STATUS_FREEZE;
        break;
      case 'past':
        gameStatus = GAME_STATUS_FINISHED;
        break;
      default:
        gameStatus = null;
    }

    if (token) {
      if (gameStatus !== GAME_STATUS_NEW) {
        await store.dispatch(mygamesModule.actions.fetchMyGames(gameStatus, token));
      } else {
        await store.dispatch(mygamesModule.actions.fetchMyGames(GAME_STATUS_NEW, token))
          .then(response => {
            if (!response.error) {
              let { rooms } = response.data;
              const tournaments = rooms.reduce((memo, room) => uniq(memo.concat(room.tournaments)), []);
              return store.dispatch(teamsModule.actions.fetchTeams(tournaments)).then(res => {
                if (!res.error) {
                  const teams = res.reduce((memo, t) => memo.concat(t.team_id), []);
                  if (teams.length > 0) {
                    return store.dispatch(playersModule.actions.fetchPlayersByTeams(teams));
                  }
                }
              });
            }
          });
      }
    }

    return <MyGames page={params.page} />;
  }
};
