import { defineMessages } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'templateDeletePopup.title',
    defaultMessage: 'Вы уверены, что хотите удалить шаблон {name} навсегда?',
    description: 'Вы уверены, что хотите удалить шаблон {name} навсегда?',
  },
  cancelLabel: {
    id: 'popup.cancelLabel',
    defaultMessage: 'Отмена',
    description: 'Отмена',
  },
  deleteLabel: {
    id: 'popup.deleteLabel',
    defaultMessage: 'Удалить',
    description: 'Удалить',
  }
});

export default messages;
