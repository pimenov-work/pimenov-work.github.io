import { defineMessages } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'rulesConfirmation.title',
    defaultMessage: 'Подтвердите свое согласие с правилами сайта',
    description: 'Подтвердите свое согласие с правилами сайта',
  },
  btnLabel: {
    id: 'rulesConfirmation.btnLabel',
    defaultMessage: 'Присоединиться',
    description: 'Присоединиться',
  },
  confirmLabel: {
    id: 'rulesConfirmation.confirmLabel',
    defaultMessage: 'Я согласен с {policyLink}',
    description: 'Я согласен с {policyLink}',
  },
  termsLabel: {
    id: 'rulesConfirmation.termsLabel',
    defaultMessage: 'правилами использования сайта',
    description: 'правилами использования сайта',
  },
});

export default messages;
