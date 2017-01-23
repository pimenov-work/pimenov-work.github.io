import { defineMessages } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'invalidBidPopup.title',
    defaultMessage: 'Команда {team} не подходит',
    description: 'Команда {team} не подходит',
  },
  changeLabel: {
    id: 'invalidBidPopup.changeLabel',
    defaultMessage: 'Изменить команду',
    description: 'Изменить команду',
  },
  cancelLabel: {
    id: 'invalidBidPopup.cancelLabel',
    defaultMessage: 'Отмена',
    description: 'Отмена',
  }
});

export default messages;
