import { createReducer } from '../../utils';
import * as actions from './actionTypes';
import { ProfileFilters } from './constants';

const initialState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isUserFetching: false,
  isTemplatesFetching: false,
  statusText: null,
  user: null,
  prizes: null,
  clientIp: null,
  templates: null,
  profile: {
    filter: ProfileFilters.SHOW_USER_SETTING
  },
  loginInformation: {
    email: '',
    password: ''
  },
  restorePassword: {
    isFetching: false,
    statusText: null,
    errorMessage: null,
    token: null
  }
};

export default createReducer(initialState, {
  [actions.LOGIN_REQUEST]: (state) => ({
    ...state,
    isAuthenticating: true
  }),
  [actions.LOGIN_FAILURE]: (state, payload) => ({
    ...state,
    isAuthenticating: false,
    statusText: `Authentification Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.LOGIN_SUCCESS]: (state, payload) => ({
    ...state,
    isAuthenticating: false,
    isAuthenticated: true,
    statusText: null,
    user: payload.user,
    stats: payload.stats,
    prizes: payload.bids
  }),
  [actions.LOGOUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    prizes: null,
    templates: null,
    statusText: 'You have been successfully logged out.'
  }),
  [actions.REGISTRATION_REQUEST]: (state) => ({
    ...state,
    isAuthenticating: true
  }),
  [actions.REGISTRATION_FAILURE]: (state, payload) => ({
    ...state,
    isAuthenticating: false,
    statusText: `Registration Process Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.REGISTRATION_SUCCESS]: (state, payload) => ({
    ...state,
    isAuthenticating: false,
    isAuthenticated: true,
    statusText: null,
    user: payload.user,
    stats: payload.stats
  }),
  [actions.FETCH_USER_REQUEST]: (state) => ({
    ...state,
    isUserFetching: true
  }),
  [actions.FETCH_USER_FAILURE]: (state, payload) => ({
    ...state,
    isUserFetching: false,
    statusText: `Fetch User Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.FETCH_USER_RECEIVE]: (state, payload) => ({
    ...state,
    isAuthenticating: false,
    isAuthenticated: true,
    isUserFetching: false,
    statusText: null,
    user: payload.user,
    stats: payload.stats,
    prizes: payload.bids
  }),
  [actions.CLIENT_IP_REQUEST]: (state) => ({
    ...state
  }),
  [actions.CLIENT_IP_FAILURE]: (state) => ({
    ...state
  }),
  [actions.CLIENT_IP_RECEIVE]: (state, payload) => ({
    ...state,
    clientIp: payload.ip
  }),
  [actions.UPDATE_LOGIN_FORM_INFO]: (state, payload) => {
    let { email, password } = payload;

    if (email !== undefined && email.length === 0) email = '';
    if (email === undefined) email = state.loginInformation.email;
    if (password !== undefined && password.length === 0) password = '';
    if (password === undefined) password = state.loginInformation.password;

    return {
      ...state,
      loginInformation: {
        email,
        password
      }
    };
  },

  [actions.RESTORE_PASSWORD_CHECK_KEY_REQUEST]: state => ({
    ...state,
    restorePassword: {
      ...state.restorePassword,
      isFetching: true
    }
  }),
  [actions.RESTORE_PASSWORD_CHECK_KEY_FAILURE]: (state, payload) => ({
    ...state,
    restorePassword: {
      ...state.restorePassword,
      isFetching: false,
      statusText: `${payload.status} ${payload.statusText}`,
      errorMessage: payload.errorMessage
    }
  }),
  [actions.RESTORE_PASSWORD_CHECK_KEY_RECEIVE]: (state, payload) => ({
    ...state,
    restorePassword: {
      ...state.restorePassword,
      isFetching: false,
      token: payload.token
    }
  }),
  [actions.CLEAR_RESTORE_PASSWORD_DATA]: (state) => ({
    ...state,
    restorePassword: {
      isFetching: false,
      statusText: null,
      errorMessage: null,
      token: null
    }
  }),
  [actions.USER_UPDATE_REQUEST]: (state) => ({
    ...state,
    isUserUpdating: true
  }),
  [actions.USER_UPDATE_FAILURE]: (state, payload) => ({
    ...state,
    isUserUpdating: false,
    statusText: `Update User Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.USER_UPDATE_RECEIVE]: (state, payload) => ({
    ...state,
    isUserUpdating: false,
    user: payload.user
  }),
  [actions.USER_TEMPLATES_REQUEST]: (state) => ({
    ...state,
    isTemplatesFetching: true
  }),
  [actions.USER_TEMPLATES_FAILURE]: (state, payload) => ({
    ...state,
    isTemplatesFetching: false,
    statusText: `Fetching User Templates Error: ${payload.status} ${payload.statusText}`
  }),
  [actions.USER_TEMPLATES_RECEIVE]: (state, payload) => ({
    ...state,
    isTemplatesFetching: false,
    templates: payload.data
  }),
  [actions.SET_PROFILE_VISIBILITY_FILTER]: (state, payload) => ({
    ...state,
    profile: {
      filter: payload.filter
    }
  })
});
