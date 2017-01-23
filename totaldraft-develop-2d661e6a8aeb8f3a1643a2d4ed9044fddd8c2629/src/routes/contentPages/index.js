import React from 'react';
import { lobbyApiUrl } from 'config';
import TermsAndConditions from 'components/TermsAndConditions';
import PrivacyPolicy from 'components/PrivacyPolicy';
import ReturnAndRefundPolicy from 'components/ReturnAndRefundPolicy';
import PaymentPolicy from 'components/PaymentPolicy';
import Help from 'components/Help';
import { getLocale } from 'modules/intl/selectors';

const routes = [
  {
    path: '/help',
    async action({ context }) { // eslint-disable-line react/prop-types
      const { store } = context;
      const state = store.getState();
      const locale = getLocale(state);

      const resp = await fetch(`${lobbyApiUrl}/pages/${locale.substring(0, 2)}/help`);
      const data = await resp.text();

      return <Help content={data} />;
    }
  },
  {
    path: '/terms-and-conditions',
    async action({ context }) { // eslint-disable-line react/prop-types
      const { store } = context;
      const state = store.getState();
      const locale = getLocale(state);

      const resp = await fetch(`${lobbyApiUrl}/pages/${locale.substring(0, 2)}/terms`);
      const data = await resp.text();

      return <TermsAndConditions content={data} />;
    }
  },
  {
    path: '/privacy-policy',
    async action({ context }) { // eslint-disable-line react/prop-types
      const { store } = context;
      const state = store.getState();
      const locale = getLocale(state);

      const resp = await fetch(`${lobbyApiUrl}/pages/${locale.substring(0, 2)}/policy_privacy`);
      const data = await resp.text();

      return <PrivacyPolicy content={data} />;
    }
  },
  {
    path: '/payment-policy',
    async action({ context }) { // eslint-disable-line react/prop-types
      const { store } = context;
      const state = store.getState();
      const locale = getLocale(state);

      const resp = await fetch(`${lobbyApiUrl}/pages/${locale.substring(0, 2)}/policy_payments`);
      const data = await resp.text();

      return <PaymentPolicy content={data} />;
    }
  },
  {
    path: '/return-and-refund-policy',
    async action({ context }) { // eslint-disable-line react/prop-types
      const { store } = context;
      const state = store.getState();
      const locale = getLocale(state);

      const resp = await fetch(`${lobbyApiUrl}/pages/${locale.substring(0, 2)}/policy_refund`);
      const data = await resp.text();

      return <ReturnAndRefundPolicy content={data} />;
    }
  },
];

export default routes;
