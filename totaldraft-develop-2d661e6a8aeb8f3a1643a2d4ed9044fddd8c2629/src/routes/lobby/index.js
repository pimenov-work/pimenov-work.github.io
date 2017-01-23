import React from 'react';
import Lobby from '../../modules/lobby/components/Lobby';
import lobby from '../../modules/lobby';

export default {
  path: '/lobby',
  async action({ context }) { // eslint-disable-line react/prop-types
    const { store } = context;

    await store.dispatch(lobby.actions.fetchRooms());

    return <Lobby />;
  }
};
