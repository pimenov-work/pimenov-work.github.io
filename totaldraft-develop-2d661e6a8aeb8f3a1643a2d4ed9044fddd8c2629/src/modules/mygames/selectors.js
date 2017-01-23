import { NAME } from './constants';

export const getAllState = state => state[NAME];
export const getFutureGames = state => state[NAME].future;
export const getPastGames = state => state[NAME].past;
export const getLiveGames = state => state[NAME].live;
export const getAllGames = state => state[NAME].all;
export const getFilter = state => state[NAME].filter;
