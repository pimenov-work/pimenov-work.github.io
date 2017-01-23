export const NAME = 'room';

/*
 * MyTeam
 */

export const MY_TEAM_GOALKEEPERS_SIZE = 2;
export const MY_TEAM_DEFENDERS_SIZE = 5;
export const MY_TEAM_MIDFIELDERS_SIZE = 5;
export const MY_TEAM_FORWARDS_SIZE = 3;
export const MY_TEAM_SIZE = MY_TEAM_GOALKEEPERS_SIZE + MY_TEAM_DEFENDERS_SIZE + MY_TEAM_MIDFIELDERS_SIZE + MY_TEAM_FORWARDS_SIZE;
export const MAX_PLAYERS_FROM_ONE_TEAM = 3;
export const RESERVE_PLAYERS_SIZE = 4;

export const DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM = 3;

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
