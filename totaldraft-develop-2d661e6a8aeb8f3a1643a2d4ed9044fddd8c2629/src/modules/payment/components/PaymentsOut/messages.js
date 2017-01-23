import { defineMessages } from 'react-intl';

const messages = defineMessages({
  withdrawalRequestLabel: {
    id: 'paymentsOut.withdrawalRequestLabel',
    defaultMessage: 'Запрос на вывод средств',
    description: 'Запрос на вывод средств',
  },
  submitLabel: {
    id: 'paymentsOut.submitLabel',
    defaultMessage: 'Отправить',
    description: 'Отправить',
  },
  moneyPlaceholder: {
    id: 'paymentsOut.moneyPlaceholder',
    defaultMessage: 'СУММА',
    description: 'СУММА',
  },
  emailPlaceholder: {
    id: 'paymentsOut.emailPlaceholder',
    defaultMessage: 'E-MAIL АДРЕС В PAYPAL',
    description: 'E-MAIL АДРЕС В PAYPAL',
  },
  minFundsLabel: {
    id: 'paymentsOut.minFundsLabel',
    defaultMessage: 'Минимальная сумма вывода',
    description: 'Минимальная сумма вывода',
  },
  withdrawalTimeLabel: {
    id: 'paymentsOut.withdrawalTimeLabel',
    defaultMessage: 'Как правило, вывод средств занимает не более 24 часов (1 рабочий день).',
    description: 'Как правило, вывод средств занимает не более 24 часов (1 рабочий день).',
  },
  policyText: {
    id: 'paymentsOut.policyText',
    defaultMessage: 'Пожалуйста, ознакомьтесь с нашими {paymentPolicyLink} и {refundPolicyLink} для получения подробной информации.',
    description: 'Пожалуйста, ознакомьтесь с нашими {paymentPolicyLink} и {refundPolicyLink} для получения подробной информации.',
  },
  paymentPolicyLinkText: {
    id: 'paymentsOut.paymentPolicyLinkText',
    defaultMessage: 'политикой совершения платежей',
    description: 'политикой совершения платежей',
  },
  refundPolicyLinkText: {
    id: 'paymentsOut.refundPolicyLinkText',
    defaultMessage: 'политикой возврата',
    description: 'политикой возврата',
  }
});

export default messages;
