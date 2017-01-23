import React from 'react';
import roomModule from 'modules/room';
import authModule from 'modules/auth';
import RoomPage from 'modules/room/components/RoomPage';
// import RoomPage from 'containers/RoomPage';

const routes = [
  {
    path: '/rooms/:id',
    async action({ context, params }) { // eslint-disable-line react/prop-types
      const { store, token } = context;
      await store.dispatch(roomModule.actions.fetchRoom(params.id));
      await store.dispatch(roomModule.actions.fetchRoomBids(params.id));

      if (token) {
        await store.dispatch(roomModule.actions.fetchUserBids(params.id, token));
        store.dispatch(authModule.actions.fetchUserTemplates(token));
      }

      return <RoomPage isMobileMenuHidden />;
    }
  },
  {
    path: '/rooms/:id/teams',
    async action({ context, params }) { // eslint-disable-line react/prop-types
      const { store } = context;
      await store.dispatch(roomModule.actions.fetchRoom(params.id));
      return <RoomPage teamBuilderEnabled isMobileMenuHidden />;
    }
  },
  {
    path: '/rooms/:id/teams/:teamId',
    async action({ context, params }) { // eslint-disable-line react/prop-types
      const { store } = context;
      await store.dispatch(roomModule.actions.fetchRoom(params.id));
      return <RoomPage teamId={params.teamId} teamBuilderEnabled isMobileMenuHidden />;
    }
  }
];

export default routes;
