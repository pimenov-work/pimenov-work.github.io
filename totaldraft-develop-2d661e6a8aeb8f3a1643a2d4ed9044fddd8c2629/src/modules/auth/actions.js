import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON, setCookie, deleteCookie } from '../../utils';
import * as actions from './actionTypes';
import { COOKIE_TOKEN_EXPIRE_DATE,
  endpointApiLogin, endpointApiRegistration, endpointApiFetchUser,
  endpointApiRestorePassword, endpointApiUpdateUser,
  endpointApiFetchUserTemplates, endpointApiDeleteTemplate, APP_MESSAGES } from '../../config';
import { redirect } from '../../routes/actions';
import { setLocale } from 'modules/intl/actions';
import { getCookie, APIErrorMatcher, getApplicationMessage } from 'utils';

import appstateModule from '../appstate';
import room from '../room';

/*
 * LOGIN PROCESS
 */

const loginUserRequest = () => ({
  type: actions.LOGIN_REQUEST
});

const loginUserFailure = (error) => ({
  type: actions.LOGIN_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

function loginUserSuccess(token, user, bids, stats) {
  if (process.env.BROWSER) {
    setCookie('access_token', token, { expires: COOKIE_TOKEN_EXPIRE_DATE });
  }

  return {
    type: actions.LOGIN_SUCCESS,
    payload: {
      token,
      user,
      stats,
      bids: bids ? bids : []
    }
  };
}

export function loginUser(email, password, clientIP = null) {
  return (dispatch) => {
    dispatch(loginUserRequest());

    let data = `email=${email}&password=${escape(password)}`;

    return fetch(endpointApiLogin, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        const { token, user, bids, stats } = response.data;

        dispatch(loginUserSuccess(token, user, bids, stats));

        const localeRegExp = new RegExp('[a-z]{2}-[A-Z]{2}'); // TODO: Find better solution. Maybe
        const locale = user && localeRegExp.test(user.data.l) ? user.data.l : undefined;
        if (locale) {
          dispatch(setLocale({ locale }));
        }
      } else {
        dispatch(loginUserFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));

        const errorText = response.data.error === 'ACTION_UNAVAILABLE' ?
          getApplicationMessage(APP_MESSAGES.WRONG_PASSWORD_OR_EMAIL) :
          APIErrorMatcher(response.data.error);

        dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
      }
      return response;
    })
    .catch(error => {
      dispatch(loginUserFailure(error));
    });
  };
}

/*
 * LOGOUT PROCESS
 */
export const logout = () => ({
  type: actions.LOGOUT
});

export function logoutAndRedirect() {
  deleteCookie('access_token');
  localStorage.removeItem('players');
  localStorage.removeItem('roomId');

  return (dispatch) => {
    dispatch(room.actions.clearRoomUserbids());

    dispatch(logout());
    dispatch(redirect('/'));
  };
}

/*
 * REGISTRATION PROCESS
 */

const registerUserRequest = () => ({
  type: actions.REGISTRATION_REQUEST
});

const registerUserFailure = (error) => ({
  type: actions.REGISTRATION_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

function registerUserSuccess(token, user, stats) {
  if (process.env.BROWSER) {
    setCookie('access_token', token, { expires: COOKIE_TOKEN_EXPIRE_DATE });
  }

  return {
    type: actions.REGISTRATION_SUCCESS,
    payload: { token, user, stats }
  };
}

export function registerUser(email, password, code, name, clientIP = null) {
  return (dispatch) => {
    dispatch(registerUserRequest());

    return fetch(endpointApiRegistration, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${email}&password=${escape(password)}&code=${code}&name=${name}`
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        const { token, user, stats } = response.data;
        dispatch(registerUserSuccess(token, user, stats));
      } else {
        dispatch(registerUserFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));

        const errorText = response.data.error === 'ACTION_UNAVAILABLE' ?
          getApplicationMessage(APP_MESSAGES.EMAIL_EXIST) :
          APIErrorMatcher(response.data.error);

        dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
      }

      return response;
    })
    .catch(error => {
      dispatch(registerUserFailure(error));
    });
  };
}

/*
 * FETCH USER
 */

const fetchUserRequest = () => ({
  type: actions.FETCH_USER_REQUEST
});

const fetchUserFailure = (error) => ({
  type: actions.FETCH_USER_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

function fetchUserReceive(data) {
  if (process.env.BROWSER) {
    setCookie('access_token', data.token, { expires: COOKIE_TOKEN_EXPIRE_DATE });
  }

  return {
    type: actions.FETCH_USER_RECEIVE,
    payload: {
      user: data.user,
      stats: data.stats,
      bids: data.bids ? data.bids : []
    }
  };
}

export function fetchUserData(token, clientIP = null) {
  return (dispatch) => {
    dispatch(fetchUserRequest());

    return fetch(endpointApiFetchUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(fetchUserFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
      } else {
        dispatch(fetchUserReceive(response.data));
      }

      return response;
    })
    .catch(error => {
      dispatch(fetchUserFailure(error));
    });
  };
}


/*
* GET CLIENT IP
*/

const getClientIpRequest = () => ({
  type: actions.CLIENT_IP_REQUEST
});

const getClientIpFailure = (error) => ({
  type: actions.CLIENT_IP_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const getClientIpReceive = (data) => ({
  type: actions.CLIENT_IP_RECEIVE,
  payload: {
    ip: data.ip
  }
});

export function getClientIP() {
  return (dispatch) => {
    dispatch(getClientIpRequest());

    return fetch('https://api.ipify.org?format=json')
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.ip) {
          dispatch(getClientIpReceive({ ip: response.ip }));
        } else {
          dispatch(getClientIpFailure({
            response: {
              status: 403,
              statusText: 'Getting IP Error'
            }
          }));
        }
        return response;
      })
      .catch(error => {
        dispatch(getClientIpFailure(error));
      });
  };
}

/*
* UPDATE LOGIN FORM DATA
*/

export const updateLoginFormInfo = (data) => ({
  type: actions.UPDATE_LOGIN_FORM_INFO,
  payload: {
    email: data.email,
    password: data.password
  }
});

/*
* RESTORE PASSWORD EMAIL
*/

const restorePasswordEmailRequest = () => ({
  type: actions.RESTORE_PASSWORD_EMAIL_REQUEST
});

const restorePasswordEmailFailure = (error) => ({
  type: actions.RESTORE_PASSWORD_EMAIL_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const restorePasswordEmailReceive = () => ({
  type: actions.RESTORE_PASSWORD_EMAIL_RECEIVE
});

export function sendRestorePasswordEmail(email) {
  return (dispatch) => {
    dispatch(restorePasswordEmailRequest());

    return fetch(endpointApiRestorePassword, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `email=${email}`
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (!response.error) {
        dispatch(restorePasswordEmailReceive(response));
      } else {
        dispatch(restorePasswordEmailFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));

        const errorText = response.data.error === 'INTERNAL' ?
          getApplicationMessage(APP_MESSAGES.SERVER_IS_NOT_AVAILABLE) :
          getApplicationMessage(APP_MESSAGES.EMAIL_NOT_EXIST);

        dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
      }
      return response;
    })
    .catch(error => {
      dispatch(restorePasswordEmailFailure(error));
    });
  };
}

/*
* RESTORE PASSWORD KEY CHECK
*/

const restorePasswordKeyCheckRequest = () => ({
  type: actions.RESTORE_PASSWORD_CHECK_KEY_REQUEST
});

const restorePasswordKeyCheckFailure = (error) => ({
  type: actions.RESTORE_PASSWORD_CHECK_KEY_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText,
    errorMessage: error.response.errorMessage ? error.response.errorMessage : ''
  }
});

const restorePasswordKeyCheckReceive = (response) => ({
  type: actions.RESTORE_PASSWORD_CHECK_KEY_RECEIVE,
  payload: {
    token: response.data.token
  }
});

export function restorePasswordKeyCheck(email, key) {
  return (dispatch) => {
    dispatch(restorePasswordKeyCheckRequest());

    return fetch(`${endpointApiRestorePassword}/${email}/${key}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!response.error) {
          dispatch(restorePasswordKeyCheckReceive(response));
        } else {
          dispatch(restorePasswordKeyCheckFailure({
            response: {
              status: 403,
              statusText: response.data.error,
              errorMessage: response.data.error === 'ACTION_UNAVAILABLE' ?
              'Ссылка недействительна' : 'Пользователь с таким email не найден'
            }
          }));
        }
        return response;
      })
      .catch(error => {
        dispatch(restorePasswordKeyCheckFailure(error));
      });
  };
}

/*
* CLEAR RESTORE PASSWORD DATA
*/

export const clearRestorePasswordData = () => ({
  type: actions.CLEAR_RESTORE_PASSWORD_DATA
});

/*
* UPDATE USER
*/

const userUpdateRequest = () => ({
  type: actions.USER_UPDATE_REQUEST
});

const userUpdateFailure = (error) => ({
  type: actions.USER_UPDATE_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const userUpdateReceive = (data) => ({
  type: actions.USER_UPDATE_RECEIVE,
  payload: {
    user: data.user
  }
});

export function userUpdate(data, token) {
  return dispatch => {
    dispatch(userUpdateRequest());

    return fetch(endpointApiUpdateUser, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(userUpdateFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
        let errorText = APIErrorMatcher(response.data.error);
        dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
      } else {
        dispatch(userUpdateReceive(response.data));
        let msg = getApplicationMessage(APP_MESSAGES.UPDATE_SUCCES);
        dispatch(appstateModule.actions.showGlobalNotification(msg));
      }

      return response;
    })
    .catch(error => {
      let msg = getApplicationMessage(APP_MESSAGES.UPDATE_FAILURE);
      dispatch(appstateModule.actions.showGlobalNotification(msg, true));
      if (error.response.status === 401) {
        dispatch(userUpdateFailure(error));
      }
    });
  };
}


/*
* FETCH USER TEMPLATE
*/

const requestUserTemplates = () => ({
  type: actions.USER_TEMPLATES_REQUEST
});

const requestUserTemplatesFailure = (error) => ({
  type: actions.USER_TEMPLATES_FAILURE,
  payload: {
    status: error.response.status,
    statusText: error.response.statusText
  }
});

const receiveUserTemplates = (response) => ({
  type: actions.USER_TEMPLATES_RECEIVE,
  payload: {
    data: response.data.templates
  }
});

export function fetchUserTemplates(token) {
  return dispatch => {
    dispatch(requestUserTemplates());

    return fetch(`${endpointApiFetchUserTemplates}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      dispatch(receiveUserTemplates(response));
      return response;
    })
    .catch(error => {
      dispatch(requestUserTemplatesFailure(error));
    });
  };
}

/*
* DELETE USER TEMPLATE
*/

export const templateDeleteRequest = () => ({
  type: actions.TEMPLATE_DELETE_REQUEST
});

export function templateDeleteFailure(error) {
  return {
    type: actions.TEMPLATE_DELETE_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function templateDeleteReceive() {
  return {
    type: actions.TEMPLATE_DELETE_RECEIVE,
    payload: {
      statusText: 'Template deleted'
    }
  };
}

export function deleteTemplate(templateId, token) {
  return dispatch => {
    dispatch(templateDeleteRequest());

    return fetch(`${endpointApiDeleteTemplate}/${templateId}`, {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(templateDeleteFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));

        const errorText = getApplicationMessage(APP_MESSAGES.TEMPLATE_DELETE_ERROR);
        dispatch(appstateModule.actions.showGlobalNotification(errorText, true));
        return false;
      } else {
        dispatch(templateDeleteReceive(response));
        return true;
      }
    })
    .catch(error => {
      dispatch(templateDeleteFailure(error));
    });
  };
}

/*
* ADD USER TEMPLATE
*/

export function templateAddRequest() {
  return {
    type: actions.TEMPLATE_ADD_REQUEST
  };
}

export function templateAddFailure(error) {
  return {
    type: actions.TEMPLATE_ADD_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function templateAddReceive(response) {
  return {
    type: actions.TEMPLATE_ADD_RECEIVE,
    payload: {
      template: response.data.template,
      statusText: 'Template added'
    }
  };
}

export function addTemplate(team, title, competitionId) {
  const token = getCookie('access_token');

  const mainPlayers = team.main;
  const reservePlayers = team.reserve;

  return dispatch => {
    dispatch(templateAddRequest());

    return fetch(`${endpointApiFetchUserTemplates}`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `main=${mainPlayers.join()}&reserve=${reservePlayers.join()}&title=${encodeURI(title)}&tournament_id=${competitionId}`
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.error) {
        dispatch(templateAddFailure({
          response: {
            status: 403,
            statusText: response.data.error
          }
        }));
      } else {
        dispatch(templateAddReceive(response));
      }
    })
    .catch(error => {
      dispatch(templateAddFailure(error));
    });
  };
}


/*
* SET PROFILE VIEWS FILTER
*/

export function setProfileVisibilityFilter(filter) {
  return {
    type: actions.SET_PROFILE_VISIBILITY_FILTER,
    payload: {
      filter
    }
  };
}
