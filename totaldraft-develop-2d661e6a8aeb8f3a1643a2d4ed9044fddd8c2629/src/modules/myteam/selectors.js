import { NAME } from './constants';

export const getMyTeam = state => state[NAME];

export const getCollectTeamFilter = state => state[NAME].collectTeam.filter;
export const getCollectTeamSort = state => state[NAME].collectTeam.sort;
export const getCollectTeamState = state => state[NAME].collectTeam;
export const getCollectTeamStatePlayerStats = state => state[NAME].collectTeam.playerStats.data;
export const getCollectTeamStateComparePlayerStats = state => state[NAME].collectTeam.comparePlayerStats.data;
export const getPlayersCountInInfiniteGrid = state => state[NAME].collectTeam.playersCountInInfiniteGrid;
export const getSelectedPlayerIndex = state => state[NAME].collectTeam.selectedPlayerIndex;
export const getSelectedPlayerPosition = state => state[NAME].collectTeam.selectedPlayerPosition;
