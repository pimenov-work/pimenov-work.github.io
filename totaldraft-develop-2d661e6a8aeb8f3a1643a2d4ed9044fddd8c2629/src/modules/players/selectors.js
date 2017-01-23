import { NAME } from './constants';

export const getPlayers = state => state[NAME].items;
export const getPlayersStats = state => state[NAME].stats.players;
