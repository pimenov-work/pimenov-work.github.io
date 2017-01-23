import React from 'react';
import HomePage from 'components/Home';
import ProtectedPage from '../../components/ProtectedPage';
import appstateModule from '../../modules/appstate';

export default {
  path: '/rules-confirmation',
  async action({ context }) { // eslint-disable-line react/prop-types
    const { store, token } = context;
    const { SHOW_RULES_CONFIRMATION } = appstateModule.constants.AuthVisibilityFilters;

    if (!token) {
      return <ProtectedPage />;
    }

    await store.dispatch(appstateModule.actions.setAuthVisibilityFilter(SHOW_RULES_CONFIRMATION));
    await store.dispatch(appstateModule.actions.showLoginScreen());

    return <HomePage />;
  },

};
