import React from 'react';
import App from '../components/App';

// Child routes
import home from './home';
import lobby from './lobby';
import contacts from './contacts';
import blocked from './blocked';
import profile from './profile';
import payments from './payments';
import mygames from './mygames';
import rooms from './rooms';
import registration from './registration';
import verification from './verification';
import rules from './rules-confirmation';
import contentPages from './contentPages';
import error from './error';
import restore from './restore';

export default {

  path: '/',

  // keep in mind, routes are evaluated in order
  children: [
    home,
    lobby,
    contacts,
    blocked,
    profile,
    payments,
    mygames,
    registration,
    verification,
    restore,
    rules,
    ...rooms,
    ...contentPages,

    // place new routes before...
    error,
  ],

  async action({ next, render, context }) {
    const component = await next();
    if (component === undefined) return component;
    const { isMobileMenuHidden } = component.props;
    return render(
      <App context={context} isMobileMenuHidden={isMobileMenuHidden}>{component}</App>
    );
  },

};
