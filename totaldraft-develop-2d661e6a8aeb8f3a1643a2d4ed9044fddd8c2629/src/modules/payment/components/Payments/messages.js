import { defineMessages } from 'react-intl';

const messages = defineMessages({
  pageTitle: {
    id: 'payments.pageTitle',
    defaultMessage: 'Ваши платежи',
    description: 'Ваши платежи',
  },
  addPaymentLabel: {
    id: 'payments.addPaymentLabel',
    defaultMessage: 'Пополнение счёта',
    description: 'Пополнение счёта',
  },
  withdrawalLabel: {
    id: 'payments.withdrawalLabel',
    defaultMessage: 'Вывод средств',
    description: 'Вывод средств',
  },
  historyLabel: {
    id: 'payments.historyLabel',
    defaultMessage: 'История',
    description: 'История',
  },
});

export default messages;
