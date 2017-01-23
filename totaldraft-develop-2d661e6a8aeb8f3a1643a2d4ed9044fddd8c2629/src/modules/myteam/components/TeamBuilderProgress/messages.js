import { defineMessages } from 'react-intl';

const messages = defineMessages({
  collectTeamLabel: {
    id: 'userGuide.collectTeamLabel',
    defaultMessage: 'Соберите команду из {total}',
    description: 'Соберите команду из {total}',
  },
  collectTeamLabelNumPlayers: {
    id: 'userGuide.collectTeamLabelNumPlayers',
    defaultMessage: '15 футболистов',
    description: '15 футболистов',
  },
  limitBudgetLabel: {
    id: 'userGuide.limitBudgetLabel',
    defaultMessage: 'Не превышайте бюджет {budget} на команду',
    description: 'Не превышайте бюджет {budget} на команду',
  },
  limitBudgetLabelNum: {
    id: 'userGuide.limitBudgetLabelNum',
    defaultMessage: '{budget} {budget, plural, one {миллион} few {миллиона} many {миллионов} other {миллионов} }',
    description: '{budget} {budget, plural, one {миллион} few {миллиона} many {миллионов} other {миллионов} }',
  },
  limitPlayersLabel: {
    id: 'userGuide.limitPlayersLabel',
    defaultMessage: 'В команде должно быть не более {num} из одного клуба',
    description: 'В команде должно быть не более ? игроков из одного клуба',
  },
  limitPlayersLabelNum: {
    id: 'userGuide.limitPlayersLabelNum',
    defaultMessage: '{num} {num, plural, one {игрока} few {игроков} many {игроков} other {игроков} }',
    description: '{num} {num, plural, one {игрока} few {игроков} many {игроков} other {игроков} }',
  },
  feeLabel: {
    id: 'userGuide.feeLabel',
    defaultMessage: 'Оплатите вступительный взнос',
    description: 'Оплатите вступительный взнос',
  }
});

export default messages;
