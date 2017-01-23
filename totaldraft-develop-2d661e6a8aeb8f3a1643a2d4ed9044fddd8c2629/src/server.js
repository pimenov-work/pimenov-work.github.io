import 'babel-polyfill';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import requestLanguage from 'express-request-language';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import './serverIntlPolyfill';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './components/ErrorPage';
import errorPageStyle from './components/ErrorPage/ErrorPage.css';
import routes from './routes';
import createHistory from './core/createHistory';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './modules/runtime/actions';
import Provide from './components/Provide';
import { setLocale } from './modules/intl/actions';
import { port, locales } from './config';
import { validateUserToken } from './utils';
import appstate from './modules/appstate';
import auth from './modules/auth';
import mygames from './modules/mygames';
import socketServer from './socket-server';
import { GAME_STATUS_FREEZE } from 'config';

const app = express();

// Authentication
const authProccess = async (store, token, clientIP) => {
  const { dispatch } = store;
  const state = store.getState();

  if (!state.auth.user && !state.auth.isUserFetching) {
    await dispatch(auth.actions.fetchUserData(token, clientIP));
    await dispatch(mygames.actions.fetchMyGames(GAME_STATUS_FREEZE, token));
  }
};

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Yandex mail confirmation html
// -----------------------------------------------------------------------------
app.get('/2c655eb2879fec6e55e0781cf4d2f1f553fa60c86be5feaeda2e8563cf3b170a.html', (req, res) => {
  fs.readFile(`${__dirname}/yandex-mail.html`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.send();
    res.end();
  });
});

//
// Handle social login redirect
// -----------------------------------------------------------------------------
app.get('/auth/success', (req, res) => {
  fs.readFile(`${__dirname}/social-login.html`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.send();
    res.end();
  });
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(requestLanguage({
  languages: locales,
  queryName: 'lang',
  cookie: {
    name: 'lang',
    options: {
      path: '/',
      maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
    },
    url: '/lang/{language}',
  },
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Enable trust proxy
// -----------------------------------------------------------------------------
app.enable('trust proxy');

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  const history = createHistory(req.url);
  // let currentLocation = history.getCurrentLocation();
  let sent = false;
  const removeHistoryListener = history.listen(location => {
    const newUrl = `${location.pathname}${location.search}`;
    if (req.originalUrl !== newUrl) {
      // console.log(`R ${req.originalUrl} -> ${newUrl}`); // eslint-disable-line no-console
      if (!sent) {
        res.redirect(303, newUrl);
        sent = true;
        next();
      } else {
        console.error(`${req.path}: Already sent!`); // eslint-disable-line no-console
      }
    }
  });

  try {
    const store = configureStore({}, {
      cookie: req.headers.cookie,
      history
    });

    // Init application and redirect unsupported IP's
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const resp = await store.dispatch(appstate.actions.initAppProcess(clientIP));
    if (!resp.error && resp.data.blocked && req.path !== '/blocked') {
      res.redirect(303, '/blocked');
      return;
    }

    const accessToken = req.cookies.access_token ? req.cookies.access_token : null;
    if (accessToken && validateUserToken(accessToken)) {
      await authProccess(store, accessToken, clientIP);
    }

    const currentState = store.getState();
    const { user } = currentState.auth;

    if (user) {
      if (!user.data.r && req.path !== '/rules-confirmation') {
        res.redirect('/rules-confirmation');
        return;
      }

      if (req.path === '/') {
        res.redirect('/lobby');
        return;
      }
    }

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    let css = new Set();
    let statusCode = 200;

    // Set the user's lang
    const localeRegExp = new RegExp('[a-z]{2}-[A-Z]{2}'); // TODO: Find better solution. Maybe
    const locale = user && localeRegExp.test(user.data.l) ? user.data.l : req.language;

    const data = {
      lang: locale,
      title: '',
      description: '',
      style: '',
      vendors: assets.vendors.js,
      script: assets.main.js,
      children: '',
    };

    store.dispatch(setRuntimeVariable({
      name: 'availableLocales',
      value: locales,
    }));

    await store.dispatch(setLocale({
      locale,
    }));

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        store,
        token: accessToken && validateUserToken(accessToken) ? accessToken : null,
        pathname: req.path,
        createHref: history.createHref,
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = new Set();
        statusCode = status;

        // Fire all componentWill... hooks
        data.children = ReactDOM.renderToString(<Provide store={store}>{component}</Provide>);

        // If you have async actions, wait for store when stabilizes here.
        // This may be asynchronous loop if you have complicated structure.
        // Then render again

        // If store has no changes, you do not need render again!
        // data.children = ReactDOM.renderToString(<Provide store={store}>{component}</Provide>);

        // It is important to have rendered output and state in sync,
        // otherwise React will write error to console when mounting on client
        data.state = store.getState();

        data.style = [...css].join('');
        return true;
      },
    });

    if (!sent) {
      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(statusCode);
      res.send(`<!doctype html>${html}`);
    }
  } catch (err) {
    next(err);
  } finally {
    removeHistoryListener();
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(statusCode);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
const webServer = app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */

//
// Link the Socket Server
// -----------------------------------------------------------------------------
socketServer(webServer);
