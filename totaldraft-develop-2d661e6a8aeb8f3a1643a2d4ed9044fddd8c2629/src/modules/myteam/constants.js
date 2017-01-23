import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  footballPosAll: {
    id: 'footballPos.All',
    defaultMessage: 'Все',
    description: 'Все',
  },
  footballPosForwards: {
    id: 'footballPos.Forwards',
    defaultMessage: 'Нападающие',
    description: 'Нападающие',
  },
  footballPosGoalkeepers: {
    id: 'footballPos.Goalkeepers',
    defaultMessage: 'Вратари',
    description: 'Вратари',
  },
  footballPosDefenders: {
    id: 'footballPos.Defenders',
    defaultMessage: 'Защитники',
    description: 'Защитники',
  },
  footballPosMidfielders: {
    id: 'footballPos.Midfielders',
    defaultMessage: 'Полузащитники',
    description: 'Полузащитники',
  },
  footballShortPosForwards: {
    id: 'footballShortPos.Forwards',
    defaultMessage: 'НП',
    description: 'НП',
  },
  footballShortPosGoalkeepers: {
    id: 'footballShortPosGK.Goalkeepers',
    defaultMessage: 'ВР',
    description: 'ВР',
  },
  footballShortPosDefenders: {
    id: 'footballShortPos.Defenders',
    defaultMessage: 'ЗЩ',
    description: 'ЗЩ',
  },
  footballShortPosMidfielders: {
    id: 'footballShortPos.Midfielders',
    defaultMessage: 'ПЗ',
    description: 'ПЗ',
  },
});

export const NAME = 'myTeam';
export const MY_TEAM_GOALKEEPERS_SIZE = 2;
export const MY_TEAM_DEFENDERS_SIZE = 6;
export const MY_TEAM_MIDFIELDERS_SIZE = 6;
export const MY_TEAM_FORWARDS_SIZE = 4;
export const MAX_PLAYERS_FROM_ONE_TEAM = 3;
export const RESERVE_PLAYERS_SIZE = 4;
export const MY_TEAM_SIZE = 15;
export const DEFAULT_MAX_PLAYERS_FROM_ONE_TEAM = 3;
export const MAIN_PLAYERS_TEAM_SIZE = MY_TEAM_SIZE - RESERVE_PLAYERS_SIZE;

export const SORT_DIRECTION_ASC = 'ASC';
export const SORT_DIRECTION_DESC = 'DESC';

export const INFINITE_PLAYERS_LIST_LOAD_VALUE = 35;

export const COLLECT_TEAM_POSITION_COLUMN = 'POSITION';
export const COLLECT_TEAM_PLAYER_NAME_COLUMN = 'NAME';
export const COLLECT_TEAM_CLUB_COLUMN = 'TEAM';
export const COLLECT_TEAM_POINTS_COLUMN = 'POINTS';
export const COLLECT_TEAM_PRICE_COLUMN = 'PRICE';

export const PLAYER_POSITIONS_ALL = 'All';
export const PLAYER_POSITIONS_G = 'G';
export const PLAYER_POSITIONS_D = 'D';
export const PLAYER_POSITIONS_M = 'M';
export const PLAYER_POSITIONS_F = 'F';

export const positionsMap = {
  All: <FormattedMessage {...messages.footballPosAll} />,
  F: <FormattedMessage {...messages.footballShortPosForwards} />,
  M: <FormattedMessage {...messages.footballShortPosMidfielders} />,
  D: <FormattedMessage {...messages.footballShortPosDefenders} />,
  G: <FormattedMessage {...messages.footballShortPosGoalkeepers} />
};

export const positionsMapFullTitle = {
  All: <FormattedMessage {...messages.footballPosAll} />,
  F: <FormattedMessage {...messages.footballPosForwards} />,
  M: <FormattedMessage {...messages.footballPosMidfielders} />,
  D: <FormattedMessage {...messages.footballPosDefenders} />,
  G: <FormattedMessage {...messages.footballPosGoalkeepers} />
};

// without reserve
export const maxPlayerSizePerPosition = {
  F: 3,
  M: 5,
  D: 5,
  G: 1
};

export const minPlayerSizePerPosition = {
  F: 1,
  M: 3,
  D: 3,
  G: 1
};
