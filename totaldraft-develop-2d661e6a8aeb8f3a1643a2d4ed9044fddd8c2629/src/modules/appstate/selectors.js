// import { createSelector } from 'reselect';
import { NAME } from './constants';

export const getRoomInfoData = state => state[NAME].roomInfoPanel;
export const getInitInfo = state => state[NAME].init;
export const getScheduleVisibilityStatus = state => state[NAME].isScheduleShown;
export const getLoginVisibleStatus = state => state[NAME].isLoginShown;
export const getAuthVisibilityFilter = state => state[NAME].authVisibilityFilter;
export const getAppStatus = state => state[NAME].appStatus;

export const getNewsStatus = state => state[NAME].isNewsShown;
export const getScheduleStatus = state => state[NAME].isScheduleShown;
export const getTournamentTableStatus = state => state[NAME].isTournamentTableShown;
export const getMobileState = state => state[NAME].mobile;
