import React from 'react';
import HomePage from 'components/Home';
import authModule from '../../modules/auth';
import { lobbyApiUrl } from '../../config';
import { checkHttpStatus, parseJSON } from '../../utils';

export default {
  path: '/verify/oauth/:id/:key',
  async action({ context, params }) { // eslint-disable-line react/prop-types
    const { store } = context;
    const state = store.getState();
    const clientIp = authModule.selectors.getClientIp(state);

    if (process.env.BROWSER) {
      const url = `${lobbyApiUrl}/user/verify/oauth/${params.id}/${params.key}`;
      const response = await fetch(url).then(checkHttpStatus).then(parseJSON);

      if (!response.error) {
        let { token } = response.data;
        await store.dispatch(authModule.actions.fetchUserData(token, clientIp));
      }
    }

    return <HomePage />;
  },

};
