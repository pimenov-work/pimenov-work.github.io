import { defineMessages } from 'react-intl';

const messages = defineMessages({
  emptyLabel: {
    id: 'paymentHistory.emptyLabel',
    defaultMessage: 'Вы не совершили ни одной транзакции',
    description: 'Вы не совершили ни одной транзакции',
  },
  titleLabel: {
    id: 'paymentHistory.titleLabel',
    defaultMessage: 'Ниже вы можете ознакомиться с историей транзакций вашего счета.',
    description: 'Ниже вы можете ознакомиться с историей транзакций вашего счета.',
  },
  debitLabel: {
    id: 'paymentHistory.debitLabel',
    defaultMessage: 'Вывод средств с вашего счета.',
    description: 'Вывод средств с вашего счета.',
  },
  creditLabel: {
    id: 'paymentHistory.creditLabel',
    defaultMessage: 'Пополнение вашего счета.',
    description: 'Пополнение вашего счета.',
  },
  dateTimeLabel: {
    id: 'paymentHistory.dateTimeLabel',
    defaultMessage: 'Дата / Время',
    description: 'Дата / Время',
  },
  statusLabel: {
    id: 'paymentHistory.statusLabel',
    defaultMessage: 'Статус',
    description: 'Статус',
  },
  descriptionLabel: {
    id: 'paymentHistory.descriptionLabel',
    defaultMessage: 'Описание',
    description: 'Описание',
  },
  operationIN: {
    id: 'paymentHistory.operationIN',
    defaultMessage: 'Пополнение в размере {money}',
    description: 'Пополнение в размере {money}',
  },
  operationOUT: {
    id: 'paymentHistory.operationOUT',
    defaultMessage: 'Снятие в размере {money}',
    description: 'Снятие в размере {money}',
  }
});

export default messages;
