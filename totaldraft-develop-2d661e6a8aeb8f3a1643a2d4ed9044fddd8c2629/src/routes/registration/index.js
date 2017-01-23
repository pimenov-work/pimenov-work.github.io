import React from 'react';
import HomePage from 'components/Home';
import appstateModule from '../../modules/appstate';

export default {
  path: '/registration',
  async action({ context }) {
    const { store } = context;
    const { SHOW_REGISTER } = appstateModule.constants.AuthVisibilityFilters;

    await store.dispatch(appstateModule.actions.setAuthVisibilityFilter(SHOW_REGISTER));
    await store.dispatch(appstateModule.actions.showLoginScreen());

    return <HomePage />;
  },

};
