import React from 'react';
import jwtDecode from 'jwt-decode';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import without from 'lodash/without';
// import basicAuth from 'basic-auth';
import { defineMessages, FormattedMessage } from 'react-intl';
import { minPlayerSizePerPosition, maxPlayerSizePerPosition, MAIN_PLAYERS_TEAM_SIZE } from '../modules/myteam/constants';
import { locales, WITHDRAWAL_STATUS_NEW, WITHDRAWAL_STATUS_CANCELED, WITHDRAWAL_STATUS_FINISHED,
 ROOM_TYPE_FLAT10, ROOM_TYPE_FLAT20, ROOM_TYPE_FLAT50, ROOM_TYPE_ALLNOTHING, API_ERROR_TYPES,
 APP_MESSAGES } from '../config';

const messages = defineMessages({
  roomStatus10: {
    id: 'lobby.roomStatus10',
    defaultMessage: '10% игроков',
    description: '10% игроков',
  },
  roomStatus20: {
    id: 'lobby.roomStatus20',
    defaultMessage: '20% игроков',
    description: '20% игроков',
  },
  roomStatus50: {
    id: 'lobby.roomStatus50',
    defaultMessage: '50% игроков',
    description: '50% игроков',
  },
  roomStatus5050: {
    id: 'lobby.roomStatus5050',
    defaultMessage: '50% игроков, приз делится равномерно',
    description: '50% игроков, приз делится равномерно',
  },
  roomStatus1: {
    id: 'lobby.roomStatus1',
    defaultMessage: '1 игрок',
    description: '1 игрок',
  },
  errorInternal: {
    id: 'API_ERRORS.INTERNAL',
    defaultMessage: 'Внутренняя ошибка сервера',
    description: 'Внутренняя ошибка сервера',
  },
  errorInvalidParams: {
    id: 'API_ERRORS.INVALID_PARAMS',
    defaultMessage: 'Присланы неверные или недостаточные параметры',
    description: 'Присланы неверные или недостаточные параметры',
  },
  errorLimitReached: {
    id: 'API_ERRORS.LIMIT_REACHED',
    defaultMessage: 'Запрашиваемое действие невозможно совершить ввиду достижения лимита',
    description: 'Запрашиваемое действие невозможно совершить ввиду достижения лимита',
  },
  errorActionUnavailable: {
    id: 'API_ERRORS.ACTION_UNAVAILABLE',
    defaultMessage: 'Действие невозможно совершить ввиду органичений внутренней логики',
    description: 'Действие невозможно совершить ввиду органичений внутренней логики',
  },
  errorNotFound: {
    id: 'API_ERRORS.NOT_FOUND',
    defaultMessage: 'Запрашиваемый объект не найден',
    description: 'Запрашиваемый объект не найден',
  },
  oauthMailInuse: {
    id: 'API_ERRORS.OAUTH_MAIL_INUSE',
    defaultMessage: 'Этот e-mail уже используется. Мы отправили на него письмо, подтвердите владение почтовым ящиком',
    description: 'Этот e-mail уже используется. Мы отправили на него письмо, подтвердите владение почтовым ящиком',
  },
  oauthInvalidData: {
    id: 'API_ERRORS.OAUTH_INVALID_DATA',
    defaultMessage: 'Не удалось получить необходимые данные (id, e-mail) от oauth провайдера',
    description: 'Не удалось получить необходимые данные (id, e-mail) от oauth провайдера',
  },
  wrongEmailOrPassword: {
    id: 'APP_MESSAGES.WRONG_PASSWORD_OR_EMAIL',
    defaultMessage: 'Неправильный логин или пароль',
    description: 'Неправильный логин или пароль',
  },
  wrongEmail: {
    id: 'APP_MESSAGES.WRONG_EMAIL',
    defaultMessage: 'Неправильный email',
    description: 'Неправильный email',
  },
  wrongPassword: {
    id: 'APP_MESSAGES.WRONG_PASSWORD',
    defaultMessage: 'Неправильный пароль',
    description: 'Неправильный пароль',
  },
  emailExist: {
    id: 'APP_MESSAGES.EMAIL_EXIST',
    defaultMessage: 'Пользователь с таким email уже существует',
    description: 'Пользователь с таким email уже существует',
  },
  emailNotExist: {
    id: 'APP_MESSAGES.EMAIL_NOT_EXIST',
    defaultMessage: 'Пользователь с таким email не найден',
    description: 'Пользователь с таким email не найден',
  },
  serverIsNotAvailable: {
    id: 'APP_MESSAGES.SERVER_IS_NOT_AVAILABLE',
    defaultMessage: 'Сервер недоступен. Попробуйте чуть позже',
    description: 'Сервер недоступен. Попробуйте чуть позже',
  },
  templateDeleteError: {
    id: 'APP_MESSAGES.TEMPLATE_DELETE_ERROR',
    defaultMessage: 'Ошибка при удалении шаблона',
    description: 'Ошибка при удалении шаблона',
  },
  playerStatsUnavailable: {
    id: 'APP_MESSAGES.PLAYER_STATS_UNAVAILABLE',
    defaultMessage: 'Статистика игрока недоступна',
    description: 'Статистика игрока недоступна',
  },
  updateSuccess: {
    id: 'APP_MESSAGES.UPDATE_SUCCES',
    defaultMessage: 'Данные успешно обновлены',
    description: 'Данные успешно обновлены',
  },
  updateFailure: {
    id: 'APP_MESSAGES.UPDATE_FAILURE',
    defaultMessage: 'Ошибка обновления',
    description: 'Ошибка обновления',
  },
  addFundsSuccess: {
    id: 'APP_MESSAGES.ADD_FUNDS_SUCCESS',
    defaultMessage: 'Ваш счет пополнен',
    description: 'Ваш счет пополнен',
  },
  addFundsFailure: {
    id: 'APP_MESSAGES.ADD_FUNDS_FAILURE',
    defaultMessage: 'Ошибка пополнения счета',
    description: 'Ошибка пополнения счета',
  },
  withdrawalFundsSuccess: {
    id: 'APP_MESSAGES.WITHDRAWAL_FUNDS_SUCCESS',
    defaultMessage: 'Ваш запрос принят. Следите за его статусом в разделе "История"',
    description: 'Ваш запрос принят. Следите за его статусом в разделе "История"',
  },
  withdrawalFundsFailure: {
    id: 'APP_MESSAGES.WITHDRAWAL_FUNDS_FAILURE',
    defaultMessage: 'Ошибка выполнения операции',
    description: 'Ошибка выполнения операции',
  },
  viewingBidDenied: {
    id: 'APP_MESSAGES.VIEWING_BID_DENIED',
    defaultMessage: 'Посмотреть состав чужой команды вы сможете после окончания приема заявок',
    description: 'Посмотреть состав чужой команды вы сможете после окончания приема заявок',
  },
  betSuccess: {
    id: 'APP_MESSAGES.BET_SUCCESS',
    defaultMessage: 'Заявка принята',
    description: 'Заявка принята',
  },
  betFailure: {
    id: 'APP_MESSAGES.BET_FAILURE',
    defaultMessage: 'Заявка не принята',
    description: 'Заявка не принята',
  },
  completeTeamError: {
    id: 'APP_MESSAGES.COMPLETE_TEAM_ERROR',
    defaultMessage: 'У вас недостаточно бюджета на команду',
    description: 'У вас недостаточно бюджета на команду',
  },
  internalAppError: {
    id: 'APP_MESSAGES.INTERNAL_APP_ERROR',
    defaultMessage: 'Внутренняя ошибка приложения',
    description: 'Внутренняя ошибка приложения',
  }
});

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function parseJSON(response) {
  return response.json();
}

export function validateEmail(email) {
  const regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  return regExp.test(email);
}

export function getCurrencySymbol(currencyCode) {
  let symbol = '';

  switch (currencyCode) {
    case 'RUR':
      symbol = '₽';
      break;
    case 'USD':
      symbol = '$';
      break;
    default:
      symbol = '₽';
  }

  return symbol;
}

export function getCurrencyTitle(currencyCode) {
  let title = '';

  switch (currencyCode) {
    case 'RUR':
      title = 'руб.';
      break;
    case 'USD':
      title = '$';
      break;
    default:
      title = 'руб.';
  }

  return title;
}

export function getRoomType(type) {
  let roomType;
  switch (type) {
    case 'FLAT-10':
      roomType = <FormattedMessage {...messages.roomStatus10} />;
      break;
    case 'FLAT-20':
      roomType = <FormattedMessage {...messages.roomStatus20} />;
      break;
    case 'FLAT-50':
      roomType = <FormattedMessage {...messages.roomStatus50} />;
      break;
    case '50/50':
      roomType = <FormattedMessage {...messages.roomStatus5050} />;
      break;
    case 'ALL/NOTHING':
      roomType = <FormattedMessage {...messages.roomStatus1} />;
      break;
    default:
      roomType = '';
      break;
  }
  return roomType;
}

export function setCookie(name, value, options) {
  options = options || {};

  options.path = '/';

  let expires = options.expires;

  if (typeof expires === 'number' && expires) {
    const d = new Date();
    d.setDate(d.getDate() + expires);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  let updatedCookie = name + '=' + value;

  for (let propName in options) {
    updatedCookie += '; ' + propName;
    const propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, '', { expires: -30, path: '/' });
}

export function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function validateUserToken(token) {
  const decodedToken = jwtDecode(token);
  const currentDate = new Date().getTime();
  const cookieDate = new Date(decodedToken.exp * 1000).getTime();
  const res = (currentDate < cookieDate);

  if (!res && process.env.BROWSER) {
    deleteCookie('access_token');
  }

  return res;
}

export function getPlayerShortName(name) {
  const firstLetter = name.slice(0, 1);
  const lastName = name.substr(name.indexOf(' ') + 1);

  return name && `${lastName} ${firstLetter}.`;
}

export function getWithdrawalStatus(status) {
  let res = '';
  switch (status) {
    case WITHDRAWAL_STATUS_NEW:
      res = 'В обработке';
      break;
    case WITHDRAWAL_STATUS_CANCELED:
      res = 'Выплата отменена';
      break;
    case WITHDRAWAL_STATUS_FINISHED:
      res = 'Выплата совершена';
      break;
    default:
      res = 'В обработке';
  }

  return res;
}

export function convertToMillion(amount) {
  const amountToConvert = amount / 1000000;
  const notCovertedMillion = (Math.round(amountToConvert * 10) / 10).toFixed(1);
  return `${notCovertedMillion} М`;
}

export function sortPlayers(playersIds, players) {
  const posRank = { F: 1, M: 2, D: 3, G: 4 };
  const sortedPlayers = sortBy(playersIds, playerId => {
    const p = players.find(tmpPlayer => tmpPlayer.id === playerId);
    const playerPosition = p ? p.pos : 'F';
    return posRank[playerPosition];
  });
  return sortedPlayers;
}

export function getLeaderPositions(total, type) {
  let x = 10;
  switch (type) {
    case ROOM_TYPE_FLAT10:
      x = 10;
      break;
    case ROOM_TYPE_FLAT20:
      x = 20;
      break;
    case ROOM_TYPE_FLAT50:
      x = 50;
      break;
    case ROOM_TYPE_ALLNOTHING:
      x = 1;
      break;
    default:
      x = 10;
  }

  const res = (x !== 1) ? Math.round(total / 100 * x) : x;

  return res;
}

export function getURLParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Get property depends on locale
export function getPropByLocale(obj, locale) {
  const l = locale.substring(0, 2);

  if (obj.hasOwnProperty(l)) {
    return obj[l];
  } else {
    const otherLocales = without(locales, locale);

    for (let i = 0; i < otherLocales.length; i++) {
      let loc = otherLocales[i].substring(0, 2);
      if (obj.hasOwnProperty(loc)) {
        return obj[loc];
      }
    }
    return null;
  }
}

// API Errors Match
export function APIErrorMatcher(errType) {
  let message = '';

  switch (errType) {
    case API_ERROR_TYPES.INTERNAL:
      message = <FormattedMessage {...messages.errorInternal} />;
      break;
    case API_ERROR_TYPES.INVALID_PARAMS:
      message = <FormattedMessage {...messages.errorInvalidParams} />;
      break;
    case API_ERROR_TYPES.LIMIT_REACHED:
      message = <FormattedMessage {...messages.errorLimitReached} />;
      break;
    case API_ERROR_TYPES.ACTION_UNAVAILABLE:
      message = <FormattedMessage {...messages.errorActionUnavailable} />;
      break;
    case API_ERROR_TYPES.NOT_FOUND:
      message = <FormattedMessage {...messages.errorNotFound} />;
      break;
    case API_ERROR_TYPES.OAUTH_MAIL_INUSE:
      message = <FormattedMessage {...messages.oauthMailInuse} />;
      break;
    case API_ERROR_TYPES.OAUTH_INVALID_DATA:
      message = <FormattedMessage {...messages.oauthInvalidData} />;
      break;
    default:
      message = <FormattedMessage {...messages.errorInternal} />;
  }

  return message;
}

// Application Errors Match
export function getApplicationMessage(errType) {
  let message = '';

  switch (errType) {
    case APP_MESSAGES.WRONG_PASSWORD_OR_EMAIL:
      message = <FormattedMessage {...messages.wrongEmailOrPassword} />;
      break;
    case APP_MESSAGES.WRONG_EMAIL:
      message = <FormattedMessage {...messages.wrongEmail} />;
      break;
    case APP_MESSAGES.WRONG_PASSWORD:
      message = <FormattedMessage {...messages.wrongPassword} />;
      break;
    case APP_MESSAGES.EMAIL_EXIST:
      message = <FormattedMessage {...messages.emailExist} />;
      break;
    case APP_MESSAGES.EMAIL_NOT_EXIST:
      message = <FormattedMessage {...messages.emailNotExist} />;
      break;
    case APP_MESSAGES.SERVER_IS_NOT_AVAILABLE:
      message = <FormattedMessage {...messages.serverIsNotAvailable} />;
      break;
    case APP_MESSAGES.TEMPLATE_DELETE_ERROR:
      message = <FormattedMessage {...messages.templateDeleteError} />;
      break;
    case APP_MESSAGES.PLAYER_STATS_UNAVAILABLE:
      message = <FormattedMessage {...messages.playerStatsUnavailable} />;
      break;
    case APP_MESSAGES.UPDATE_SUCCES:
      message = <FormattedMessage {...messages.updateSuccess} />;
      break;
    case APP_MESSAGES.UPDATE_FAILURE:
      message = <FormattedMessage {...messages.updateFailure} />;
      break;
    case APP_MESSAGES.ADD_FUNDS_SUCCESS:
      message = <FormattedMessage {...messages.addFundsSuccess} />;
      break;
    case APP_MESSAGES.ADD_FUNDS_FAILURE:
      message = <FormattedMessage {...messages.addFundsFailure} />;
      break;
    case APP_MESSAGES.WITHDRAWAL_FUNDS_SUCCESS:
      message = <FormattedMessage {...messages.withdrawalFundsSuccess} />;
      break;
    case APP_MESSAGES.WITHDRAWAL_FUNDS_FAILURE:
      message = <FormattedMessage {...messages.withdrawalFundsFailure} />;
      break;
    case APP_MESSAGES.VIEWING_BID_DENIED:
      message = <FormattedMessage {...messages.viewingBidDenied} />;
      break;
    case APP_MESSAGES.BET_SUCCESS:
      message = <FormattedMessage {...messages.betSuccess} />;
      break;
    case APP_MESSAGES.BET_FAILURE:
      message = <FormattedMessage {...messages.betFailure} />;
      break;
    case APP_MESSAGES.COMPLETE_TEAM_ERROR:
      message = <FormattedMessage {...messages.completeTeamError} />;
      break;
    default:
      message = <FormattedMessage {...messages.internalAppError} />;
  }

  return message;
}

export function checkAvailablePositionInMyTeam(teamPlayers) {
  let result = { F: false, M: false, D: false, G: false };
  let neededSlotsByPosition = { F: 0, M: 0, D: 0, G: 0 };
  let currentTeamState = { F: 0, M: 0, D: 0, G: 0 };
  let neededSlotsCounter = 0;

  const mainPlayersCounter = teamPlayers.reduce((с, p) => p.isMain ? с + 1 : с, 0);
  const groupedByPosition = groupBy(teamPlayers, p => p.isMain ? p.pos : 'reserve');

  const availablePlaces = MAIN_PLAYERS_TEAM_SIZE - mainPlayersCounter;

  // Текущее состояние команды (без резерва)
  for (let pos in currentTeamState) {
    let playersAtPosition = teamPlayers.reduce((counter, p) => {
      return (p.pos === pos && p.isMain) ? counter + 1 : counter;
    }, 0);
    currentTeamState[pos] = playersAtPosition;
  }

  // Проверяем заполнение обязательных позиций
  for (let pos in minPlayerSizePerPosition) {
    if (!groupedByPosition[pos] || groupedByPosition[pos].length < minPlayerSizePerPosition[pos]) {
      result[pos] = true;
    }
  }

  // Проверяем на свободные места в команде и
  // подсчитываем кол-во оставшихся обязательных мест на позициях
  for (let pos in currentTeamState) {
    neededSlotsByPosition[pos] = 0;
    if (currentTeamState[pos] < minPlayerSizePerPosition[pos]) {
      neededSlotsByPosition[pos] = minPlayerSizePerPosition[pos] - currentTeamState[pos];
    }
  }

  // кол-во игроков, которое надо донабрать
  for (let pos in neededSlotsByPosition) {
    neededSlotsCounter += neededSlotsByPosition[pos];
  }

  // Если кол-во свободных слотов больше необходимых, то разрешаем
  // добавление игроков в любую позицию
  if (availablePlaces > neededSlotsCounter) {
    result = {
      F: currentTeamState.F < maxPlayerSizePerPosition.F,
      M: currentTeamState.M < maxPlayerSizePerPosition.M,
      D: currentTeamState.D < maxPlayerSizePerPosition.D,
      G: currentTeamState.G < maxPlayerSizePerPosition.G
    };
  }

  // console.log('/////');
  // console.log('Сгруппированы по позициям:', groupedByPosition);
  // console.log('Осталось мест в команде:', availablePlaces);
  // console.log('Сколько надо донабрать по минимуму на позиции:', neededSlotsCounter);
  // console.log('Текущее состояние команды:', currentTeamState);
  // console.log('Надо донабрать по позициям:', neededSlotsByPosition);
  // console.log('Результат:', result);

  return result;
}

// Basic HTTP Auth
// export const basicAuthProccess = (req, res, next) => {
//   const unauthorized = (response) => {
//     response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//     return response.sendStatus(401);
//   };

//   const user = basicAuth(req);
//   const host = req.get('host');

//   if (host.indexOf('dev.totaldraft.com') > -1) {
//     if (!user || !user.name || !user.pass) {
//       return unauthorized(res);
//     }
//     return (user.name === LOGIN_DEV && user.pass === PASSWORD_DEV) ? next() : unauthorized(res);
//   }
//   return next();
// };
