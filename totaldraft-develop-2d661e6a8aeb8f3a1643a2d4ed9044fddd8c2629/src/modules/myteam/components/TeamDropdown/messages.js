import { defineMessages } from 'react-intl';

const messages = defineMessages({
  allTeamsLabel: {
    id: 'teamsDropdown.allTeamsLabel',
    defaultMessage: 'Все команды',
    description: 'Все команды',
  },
  filterTeamsLabel: {
    id: 'teamsDropdown.filterTeamsLabel',
    defaultMessage: 'Выбрано {num} {num, plural, one {команда} few {команды} many {команд} other {команды} }',
    description: 'Выбрано ? команд',
  }
});

export default messages;
