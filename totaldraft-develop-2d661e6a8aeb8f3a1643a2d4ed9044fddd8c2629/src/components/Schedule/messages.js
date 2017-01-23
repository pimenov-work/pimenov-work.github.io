import { defineMessages } from 'react-intl';

const messages = defineMessages({
  allTeamsLabel: {
    id: 'schedule.allTeamsLabel',
    defaultMessage: 'Все команды',
    description: 'Все команды',
  },
  filterOneTeamLabel: {
    id: 'schedule.filterOneTeamLabel',
    defaultMessage: 'Выбрана команда: {team}',
    description: 'Выбрана команда: {team}',
  },
  filterTeamsLabel: {
    id: 'schedule.filterTeamsLabel',
    defaultMessage: 'Выбрано {num} {num, plural, one {команда} few {команды} many {команд} other {команды} }',
    description: 'Выбрано ? команд',
  },
  filterReset: {
    id: 'schedule.filterReset',
    defaultMessage: 'Сбросить фильтр',
    description: 'Сбросить фильтр',
  },
  placeLabel: {
    id: 'schedule.placeLabel',
    defaultMessage: 'место',
    description: 'место',
  },
});

export default messages;
