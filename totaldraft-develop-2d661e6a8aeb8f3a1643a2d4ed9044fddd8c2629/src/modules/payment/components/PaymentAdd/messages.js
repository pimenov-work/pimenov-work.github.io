import { defineMessages } from 'react-intl';

const messages = defineMessages({
  formTitle: {
    id: 'paymentAdd.formTitle',
    defaultMessage: 'Пополните свой баланс',
    description: 'Пополните свой баланс',
  },
  amountLabel: {
    id: 'paymentAdd.amountLabel',
    defaultMessage: 'Сумма',
    description: 'Сумма',
  },
  buttonLabel: {
    id: 'paymentAdd.buttonLabel',
    defaultMessage: 'Пополнить счёт',
    description: 'Пополнить счёт',
  },
  policyText: {
    id: 'paymentAdd.policyText',
    defaultMessage: 'Пожалуйста, ознакомьтесь с нашими {paymentPolicyLink} и {refundPolicyLink} для получения подробной информации.',
    description: 'Пожалуйста, ознакомьтесь с нашими {paymentPolicyLink} и {refundPolicyLink} для получения подробной информации.',
  },
  paymentPolicyLinkText: {
    id: 'paymentAdd.paymentPolicyLinkText',
    defaultMessage: 'политикой совершения платежей',
    description: 'политикой совершения платежей',
  },
  refundPolicyLinkText: {
    id: 'paymentAdd.refundPolicyLinkText',
    defaultMessage: 'политикой возврата',
    description: 'политикой возврата',
  }
});

export default messages;
