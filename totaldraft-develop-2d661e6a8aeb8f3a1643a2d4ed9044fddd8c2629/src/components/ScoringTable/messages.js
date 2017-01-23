import { defineMessages } from 'react-intl';

const messages = defineMessages({
  userActions: {
    id: 'scoringTable.userActions',
    defaultMessage: 'Личные действия игрока',
    description: 'Личные действия игрока',
  },
  goalkeeper: {
    id: 'scoringTable.posGoalkeeper',
    defaultMessage: 'ВР',
    description: 'ВР',
  },
  defender: {
    id: 'scoringTable.posDefender',
    defaultMessage: 'ЗЩ',
    description: 'ЗЩ',
  },
  midfielder: {
    id: 'scoringTable.posMidfielder',
    defaultMessage: 'ПЗ',
    description: 'ПЗ',
  },
  forward: {
    id: 'scoringTable.posForward',
    defaultMessage: 'НП',
    description: 'НП',
  },
  minutesLess60: {
    id: 'scoringTable.minLess60',
    defaultMessage: 'Минут на поле < 60',
    description: 'Минут на поле < 60',
  },
  minutesMore60: {
    id: 'scoringTable.minMore60',
    defaultMessage: 'Минут на поле >= 60',
    description: 'Минут на поле >= 60',
  },
  assist: {
    id: 'scoringTable.assist',
    defaultMessage: 'Голевая передача',
    description: 'Голевая передача',
  },
  scoredGoal: {
    id: 'scoringTable.scoredGoal',
    defaultMessage: 'Забитый гол',
    description: 'Забитый гол',
  },
  yellowCard: {
    id: 'scoringTable.yellowCard',
    defaultMessage: 'Желтая карточка',
    description: 'Желтая карточка',
  },
  redCard: {
    id: 'scoringTable.redCard',
    defaultMessage: 'Красная карточка',
    description: 'Красная карточка',
  },
  allowedGoal: {
    id: 'scoringTable.allowedGoal',
    defaultMessage: 'Пропущенный гол',
    description: 'Пропущенный гол',
  },
  ownGoal: {
    id: 'scoringTable.ownGoal',
    defaultMessage: 'Автогол',
    description: 'Автогол',
  },
  teamRating: {
    id: 'scoringTable.teamRating',
    defaultMessage: 'Командные показатели (только при игре >= 60 мин)',
    description: 'Командные показатели (только при игре >= 60 мин)',
  },
  cleanSheet: {
    id: 'scoringTable.cleanSheet',
    defaultMessage: 'Сухой матч',
    description: 'Сухой матч',
  },
  every3saves: {
    id: 'scoringTable.every3saves',
    defaultMessage: 'Каждые 3 сейва',
    description: 'Каждые 3 сейва',
  },
  ballPossession: {
    id: 'scoringTable.ballpossession',
    defaultMessage: 'Владение мячом >= 60%',
    description: 'Владение мячом >= 60%',
  },
  target5shots: {
    id: 'scoringTable.target5shots',
    defaultMessage: 'Каждые 5 ударов в створ',
    description: 'Каждые 5 ударов в створ',
  },
  scored2goals: {
    id: 'scoringTable.scored2goals',
    defaultMessage: 'Каждые 2 забитых гола',
    description: 'Каждые 2 забитых гола',
  }
});

export default messages;
