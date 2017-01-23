import React from 'react';
import ProtectedPage from 'components/ProtectedPage';
import auth from 'modules/auth';
import Profile from 'components/Profile';

export default {
  path: '/profile',
  async action({ context }) { // eslint-disable-line react/prop-types
    const state = context.store.getState();
    const user = auth.selectors.getUser(state);
    return !user ? <ProtectedPage /> : <Profile />;
  }
};
