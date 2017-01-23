import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import s from './Payments.css';
import PaymentAdd from '../PaymentAdd';
import PaymentOut from '../PaymentsOut';
import PaymentHistory from '../PaymentHistory';
import { getCookie } from 'utils';
import { PaymentFilters } from '../../constants';
import auth from 'modules/auth';
import payment from 'modules/payment';
import messages from './messages';

class Payments extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    paymentFilter: PropTypes.string,
    paymentHistoryData: PropTypes.array,
    user: PropTypes.object,
    intl: PropTypes.object.isRequired,
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));
  }

  cashOut(money, email) {
    const { dispatch } = this.props;
    const token = getCookie('access_token');

    dispatch(payment.actions.withdrawalFundsProccess(money, email, token)).then(res => {
      if (!res.error) {
        dispatch(payment.actions.getWithdrawalRequests(token));
      }
    });
  }

  render() {
    const { dispatch, paymentFilter, paymentHistoryData, user } = this.props;

    const isAddDeposit = (paymentFilter === PaymentFilters.SHOW_ADD_DEPOSIT);
    const isCashOut = (paymentFilter === PaymentFilters.SHOW_CASH_OUT);
    const isHistory = (paymentFilter === PaymentFilters.SHOW_HISTORY);

    return (
      <div className={s.root}>
        <header className={s.header}>
          <nav className={s.menu}>
            <span
              className={cx(s.menuItem, { [s.menuItemIsActive]: isAddDeposit })}
              onClick={() => dispatch(payment.actions.setPaymentVisibilityFilter(PaymentFilters.SHOW_ADD_DEPOSIT))}
            ><FormattedMessage {...messages.addPaymentLabel} /></span>
            <span
              className={cx(s.menuItem, { [s.menuItemIsActive]: isCashOut })}
              onClick={() => dispatch(payment.actions.setPaymentVisibilityFilter(PaymentFilters.SHOW_CASH_OUT))}
            ><FormattedMessage {...messages.withdrawalLabel} /></span>
            <span
              className={cx(s.menuItem, { [s.menuItemIsActive]: isHistory })}
              onClick={() => dispatch(payment.actions.setPaymentVisibilityFilter(PaymentFilters.SHOW_HISTORY))}
            ><FormattedMessage {...messages.historyLabel} /></span>
          </nav>
        </header>
        <div className={s.content}>
          {isAddDeposit ?
            <PaymentAdd />
          : null}
          {isCashOut ?
            <PaymentOut user={user} cashOut={(money, email) => this.cashOut(money, email)} />
          : null}
          {isHistory ?
            <PaymentHistory historyData={paymentHistoryData} />
          : null}
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    paymentFilter: payment.selectors.getFilter,
    paymentHistoryData: payment.selectors.getHistoryData,
    user: auth.selectors.getUser
  })
)(withStyles(s)(Payments)));
