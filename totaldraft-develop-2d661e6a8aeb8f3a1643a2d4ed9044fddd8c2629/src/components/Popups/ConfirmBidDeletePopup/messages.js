import { defineMessages } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'confirmBidDeletePopup.title',
    defaultMessage: 'Вы уверены, что хотите удалить команду {team} из комнаты',
    description: 'Вы уверены, что хотите удалить команду {team} из комнаты',
  },
  deleteLabel: {
    id: 'confirmBidDeletePopup.deleteLabel',
    defaultMessage: 'Удалить',
    description: 'Удалить',
  },
  cancelLabel: {
    id: 'confirmBidDeletePopup.cancelLabel',
    defaultMessage: 'Отмена',
    description: 'Отмена',
  }
});

export default messages;
