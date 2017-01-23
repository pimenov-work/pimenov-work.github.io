import React from 'react';
import Home from 'components/Home';
// import lobby from '../../modules/lobby';

export default {
  path: '/',
  async action({ context }) { // eslint-disable-line react/prop-types
    // const { store } = context;
    // await store.dispatch(lobby.actions.fetchRooms());
    return <Home />;
  },

};
