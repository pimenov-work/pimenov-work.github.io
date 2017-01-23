import { NAME } from './constants';

export const getUser = state => state[NAME].user;
export const getUserTemplates = state => state[NAME].templates;
export const getUserPrizes = state => state[NAME].prizes;
export const getUserStats = state => state[NAME].stats;
export const getClientIp = state => state[NAME].clientIp;
export const getStatusMessage = state => state[NAME].statusText;
export const getLoginInformation = state => state[NAME].loginInformation;
export const getProfileFilter = state => state[NAME].profile.filter;
export const getRestorePasswordData = state => state[NAME].restorePassword;
