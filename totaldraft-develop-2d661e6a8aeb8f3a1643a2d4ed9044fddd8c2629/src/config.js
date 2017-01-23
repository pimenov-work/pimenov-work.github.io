export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

// default locale is the first one
export const locales = ['ru-RU', 'en-GB'];

export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },
};

export const serverMode = process.env.SERVER_MODE;

export const COOKIE_TOKEN_EXPIRE_DATE = new Date(new Date().getTime() + 60 * 60 * 3 * 24 * 1000); // 3 days

export const googleTagManagerCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
`new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
`j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
`'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
`})(window,document,'script','dataLayer','GTM-WVD386');`;

export const metrikaCode = `!function(e,t,a){(t[a]=t[a]||[]).push(function(){try{t.yaCounter37873335=new Ya.Metrika(` +
`{id:37873335,clickmap:!0,trackLinks:!0,accurateTrackBounce:!0,webvisor:!0,trackHash:!0})}catch(e){}});` +
`var c=e.getElementsByTagName("script")[0],n=e.createElement("script"),` +
`r=function(){c.parentNode.insertBefore(n,c)};n.type="text/javascript",` +
`n.async=!0,n.src="https://mc.yandex.ru/metrika/watch.js","[object Opera]"==t.opera?` +
`e.addEventListener("DOMContentLoaded",r,!1):r()}(document,window,"yandex_metrika_callbacks");`;

/*
 * Twitter API credentials
 */

export const TWITTER_API_KEY = 'kL03yIpsfQ0pUwqRoo5VAfiiz';
export const TWITTER_API_SECRET = '5qjHnl26lPFq4OboUTuZqwS0EypPHuNiaHtuktWOsH2k0jiFay';
export const TWITTER_ACCESS_TOKEN = '728122690247090176-tj7eJICq2xwMnsN8nsJIdW4zONqrT9k';
export const TWITTER_ACCESS_TOKEN_SECRET = 'MkqKYDzoy9PGRIZ3BlBqRTN6xkZtdLoMcZMIVt8Rs7o7d';

/*
 * API URLs
 */

export const statsApiUrl = process.env.SERVER_MODE === 'stage' ? 'http://dev-stats.totaldraft.com' : 'https://stats.totaldraft.com';
export const lobbyApiUrl = process.env.SERVER_MODE === 'stage' ? 'http://dev-lobby.totaldraft.com' : 'https://lobby.totaldraft.com';

// export const statsApiUrl = 'https://stats.totaldraft.com';
// export const lobbyApiUrl = 'https://lobby.totaldraft.com';

/*
 * API endpoints
 */
export const endpointApiLogin = `${lobbyApiUrl}/user/auth`;
export const endpointApiRegistration = `${lobbyApiUrl}/user/reg`;
export const endpointApiFetchLobbyRooms = `${lobbyApiUrl}/rooms`;
export const endpointApiFetchRoom = `${lobbyApiUrl}/rooms`;
export const endpointApiFetchRoomBids = `${lobbyApiUrl}/rooms`;
export const endpointApiFetchUserBids = `${lobbyApiUrl}/rooms`;
export const endpointApiRequestBid = `${lobbyApiUrl}/rooms`;
export const endpointApiFetchUser = `${lobbyApiUrl}/user/info`;
export const endpointApiFetchUserTemplates = `${lobbyApiUrl}/user/templates`;
export const endpointApiDeleteTemplate = `${lobbyApiUrl}/user/templates`;
export const endpointApiUpdateUser = `${lobbyApiUrl}/user/info`;
export const endpointApiFetchTeams = `${lobbyApiUrl}/rooms`;
export const endpointApiAddDeposit = `${lobbyApiUrl}/user/account`;
export const endpointApiFetchTournaments = `${statsApiUrl}/tournaments`;
export const endpointApiFetchMatches = `${statsApiUrl}/tournaments`;
export const endpointApiFetchRoundStats = `${statsApiUrl}/tournaments`;
export const endpointApiFetchMyGames = `${lobbyApiUrl}/user/bids/status`;
export const endpointApiRestorePassword = `${lobbyApiUrl}/user/restore`;
export const endpointApiGetWithdrawalRequests = `${lobbyApiUrl}/user/payments`;
export const endpointApiWithdrawalRequest = `${lobbyApiUrl}/user/payments`;
export const endpointApiInitApp = `${lobbyApiUrl}/user/init`;


/*
 * Notification Bar Timeout
 */

export const NotificationBarTimeout = 4000;

/*
 * Months
 */

export const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const monthsNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

/*
 * Load Game status param: NEW, FREEZE, FINISHED, ALL
 */

export const GAME_STATUS_NEW = 'NEW';
export const GAME_STATUS_FREEZE = 'FREEZE';
export const GAME_STATUS_FINISHED = 'FINISHED';
export const GAME_STATUS_ALL = 'ALL';

/*
 * Bid Statuses: NEW, FREEZE, READY, CANCELED, FINISHED
 */

export const BID_STATUS_NEW = 'NEW';
export const BID_STATUS_FREEZE = 'FREEZE';
export const BID_STATUS_READY = 'READY';
export const BID_STATUS_CANCELED = 'CANCELED';
export const BID_STATUS_FINISHED = 'FINISHED';

/*
 * Room Statuses: NEW, FREEZE, FINISHED
 */

export const ROOM_STATUS_NEW = 'NEW';
export const ROOM_STATUS_FREEZE = 'FREEZE';
export const ROOM_STATUS_FINISHED = 'FINISHED';

/*
 * Room Types
 */

export const ROOM_TYPE_FLAT10 = 'FLAT-10';
export const ROOM_TYPE_FLAT20 = 'FLAT-20';
export const ROOM_TYPE_FLAT50 = 'FLAT-50';
export const ROOM_TYPE_ALLNOTHING = 'ALL/NOTHING';

/*
 * Withdrawal Statuses
 */

export const WITHDRAWAL_STATUS_NEW = 'NEW';
export const WITHDRAWAL_STATUS_CANCELED = 'CANCELED';
export const WITHDRAWAL_STATUS_FINISHED = 'FINISHED';

/*
 * Login / Password
 */

export const LOGIN_DEV = 'Fantasy';
export const PASSWORD_DEV = 'fantasy.1';
export const LOGIN_PROD = '123';
export const PASSWORD_PROD = '123';


/*
 * API Error Types
 */

export const API_ERROR_TYPES = {
  INTERNAL: 'INTERNAL',
  INVALID_PARAMS: 'INVALID_PARAMS',
  LIMIT_REACHED: 'LIMIT_REACHED',
  ACTION_UNAVAILABLE: 'ACTION_UNAVAILABLE',
  NOT_FOUND: 'NOT_FOUND',
  OAUTH_MAIL_INUSE: 'OAUTH_MAIL_INUSE',
  OAUTH_INVALID_DATA: 'OAUTH_INVALID_DATA',
};

/*
 * Application messages
 */

export const APP_MESSAGES = {
  WRONG_PASSWORD_OR_EMAIL: 'WRONG_PASSWORD_OR_EMAIL',
  WRONG_EMAIL: 'WRONG_EMAIL',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  EMAIL_EXIST: 'EMAIL_EXIST',
  EMAIL_NOT_EXIST: 'EMAIL_NOT_EXIST',
  SERVER_IS_NOT_AVAILABLE: 'SERVER_IS_NOT_AVAILABLE',
  TEMPLATE_DELETE_ERROR: 'TEMPLATE_DELETE_ERROR',
  PLAYER_STATS_UNAVAILABLE: 'PLAYER_STATS_UNAVAILABLE',
  UPDATE_SUCCES: 'UPDATE_SUCCES',
  UPDATE_FAILURE: 'UPDATE_FAILURE',
  ADD_FUNDS_SUCCESS: 'ADD_FUNDS_SUCCESS',
  ADD_FUNDS_FAILURE: 'ADD_FUNDS_FAILURE',
  WITHDRAWAL_FUNDS_SUCCESS: 'WITHDRAWAL_FUNDS_SUCCESS',
  WITHDRAWAL_FUNDS_FAILURE: 'WITHDRAWAL_FUNDS_FAILURE',
  VIEWING_BID_DENIED: 'VIEWING_BID_DENIED',
  BET_SUCCESS: 'BET_SUCCESS',
  BET_FAILURE: 'BET_FAILURE',
  INTERNAL_APP_ERROR: 'INTERNAL_APP_ERROR',
  COMPLETE_TEAM_ERROR: 'COMPLETE_TEAM_ERROR',
};
