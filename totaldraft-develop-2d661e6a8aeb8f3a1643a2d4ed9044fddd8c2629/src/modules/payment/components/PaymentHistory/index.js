import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PaymentHistory.css';
import { getWithdrawalStatus } from 'utils';
import messages from './messages';

class PaymentHistory extends Component {

  static propTypes = {
    historyData: PropTypes.array.isRequired
  };

  handleInputCashKeyDown(e) {
    const charCode = e.keyCode;
    if (charCode < 48
      && charCode !== 8
      && charCode !== 9
      && charCode !== 37
      && charCode !== 39
      && charCode !== 46
      || charCode > 57) {
      e.preventDefault();
    }
  }

  handleInputCashChange(e) {
    this.setState({ cash: e.currentTarget.value });
  }

  handleInputEmailChange(e) {
    this.setState({ email: e.currentTarget.value });
  }

  render() {
    const history = this.props.historyData;

    return (
      <div className={s.root}>
        <div className={s.content}>
          {history && history.length > 0 ?
            <div>
              <p>
                <FormattedMessage {...messages.titleLabel} />
              </p>
              <p>
                <span className={s.textIsGreen}>Credit</span> - <FormattedMessage {...messages.creditLabel} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className={s.textIsBlue}>Debit</span> - <FormattedMessage {...messages.debitLabel} />
              </p>
              <table>
                <thead>
                  <tr>
                    <td>ID</td>
                    <td><FormattedMessage {...messages.dateTimeLabel} /></td>
                    <td><FormattedMessage {...messages.statusLabel} /></td>
                    <td><FormattedMessage {...messages.descriptionLabel} /></td>
                  </tr>
                </thead>
                <tbody>
                  {history.map(transaction => {
                    const dt = new Date(transaction.date);
                    return (
                      <tr
                        className={cx(s.debit, { [s.credit]: transaction.direction === 'IN' })}
                        key={transaction.payment_id}
                      >
                        <td>{`#${transaction.payment_id}`}</td>
                        <td>{`${dt.getDate()}.${(dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1}.${dt.getFullYear()} / ${dt.getHours()}:${dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()}`}</td>
                        <td>{getWithdrawalStatus(transaction.status)}</td>
                        <td>
                          {transaction.direction === 'IN' ?
                            <FormattedMessage
                              {...messages.operationIN}
                              values={{
                                money: `${transaction.money} ₽`
                              }}
                            />
                          :
                            <FormattedMessage
                              {...messages.operationOUT}
                              values={{
                                money: `${transaction.money} ₽`
                              }}
                            />
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          :
            <p>
              <FormattedMessage {...messages.emptyLabel} />
            </p>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(s)(PaymentHistory);
