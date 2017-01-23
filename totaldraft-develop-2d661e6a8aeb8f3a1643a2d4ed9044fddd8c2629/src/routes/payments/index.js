import React from 'react';
import ProtectedPage from 'components/ProtectedPage';
import Payments from '../../modules/payment/components/Payments';
import auth from 'modules/auth';
import paymentModule from 'modules/payment';

export default {
  path: '/payments',
  async action({ context }) {
    const { store, token } = context;
    const state = store.getState();
    const user = auth.selectors.getUser(state);

    const { PaymentFilters, WITHDRAWAL_STATUS_NEW } = paymentModule.constants;

    if (token) {
      await store.dispatch(paymentModule.actions.getWithdrawalRequests(token)).then(res => {
        if (!res.error) {
          const { payments } = res.data;
          const activeTransactions = payments.filter(t => t.status === WITHDRAWAL_STATUS_NEW);
          if (activeTransactions.length > 0) {
            store.dispatch(paymentModule.actions.setPaymentVisibilityFilter(PaymentFilters.SHOW_HISTORY));
          }
        }
      });
    }

    return !user ? <ProtectedPage /> : <Payments />;
  }
};
