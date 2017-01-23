import { defineMessages } from 'react-intl';

const messages = defineMessages({
  addTeamLabel: {
    id: 'templatesPanel.addTeamLabel',
    defaultMessage: 'Добавить команду',
    description: 'Добавить команду',
  },
  collectTeamLabel: {
    id: 'templatesPanel.collectTeamLabel',
    defaultMessage: 'Собрать команду',
    description: 'Собрать команду',
  },
  useTeamLabel: {
    id: 'templatesPanel.useTeamLabel',
    defaultMessage: 'Использовать шаблон',
    description: 'Использовать шаблон',
  },
  errorInvalidBudget: {
    id: 'templatesPanel.errorInvalidBudget',
    defaultMessage: 'Превышен допустимый бюджет комнаты {budget}',
    description: 'Превышен допустимый бюджет комнаты {budget}',
  },
  errorNumPlayersFromOneTeam: {
    id: 'templatesPanel.errorNumPlayersFromOneTeam',
    defaultMessage: 'Превышено максимальное количество игроков из одной команды',
    description: 'Превышено максимальное количество игроков из одной команды',
  },
  errorPlayersRevoked: {
    id: 'templatesPanel.errorPlayersRevoked',
    defaultMessage: 'Некоторые игроки этой команды отозваны',
    description: 'Некоторые игроки этой команды отозваны',
  },
});

export default messages;
