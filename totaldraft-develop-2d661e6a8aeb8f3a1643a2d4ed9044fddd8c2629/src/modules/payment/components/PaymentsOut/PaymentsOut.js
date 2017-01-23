import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import IconSVG from 'components/IconSVG';
import s from './PaymentsOut.css';
import messages from './messages';

class PaymentOut extends Component {

  static propTypes = {
    cashOut: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      cash: null,
      email: props.user ? props.user.email : '',
      isValid: false
    };
  }

  onSubmit() {
    this.props.cashOut(this.state.cash, this.state.email);
    this.refs.inputEmail.value = '';
    this.refs.inputMoney.value = '';
    this.setState({ cash: '', email: '', isValid: false });
  }

  handleInputCashKeyDown(e) {
    const charCode = e.keyCode;
    const validKeys = [8, 9, 37, 39, 46];

    if ((charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)
      && validKeys.indexOf(charCode) === -1) {
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
    const { formatMessage } = this.props.intl;

    return (
      <div className={s.root}>
        <div className={s.label}>
          {formatMessage(messages.withdrawalRequestLabel)}:
        </div>
        <img className={s.paymentTypeIcon} src="/images/paypal.png" />
        <div className={s.form}>
          <div className={s.formInlineSection}>
            <input
              className={s.inputPrice}
              type="text"
              ref="inputMoney"
              placeholder={formatMessage(messages.moneyPlaceholder)}
              tabIndex="1"
              autoComplete="off"
              onKeyDown={(e) => this.handleInputCashKeyDown(e)}
              onChange={(e) => this.handleInputCashChange(e)}
            />
            <input
              type="email"
              ref="inputEmail"
              value={this.state.email}
              placeholder={formatMessage(messages.emailPlaceholder)}
              tabIndex="2"
              autoComplete="off"
              onChange={(e) => this.handleInputEmailChange(e)}
            />
          </div>
        </div>
        <div className={s.content}>
          <b>{formatMessage(messages.minFundsLabel)}: 1000 ₽</b>
          <p>
            {formatMessage(messages.withdrawalTimeLabel)}<br />
            <FormattedMessage
              {...messages.policyText}
              values={{
                paymentPolicyLink: <a href="/payment-policy" target="_blank" rel="noopener noreferrer"><FormattedMessage {...messages.paymentPolicyLinkText} /></a>,
                refundPolicyLink: <a href="/return-and-refund-policy" target="_blank" rel="noopener noreferrer"><FormattedMessage {...messages.refundPolicyLinkText} /></a>
              }}
            />
          </p>
        </div>
        <div className={s.paymentServices}>
          <img src="/images/vbyvisa_blu.png" alt="Verified by VISA" />
          <img src="/images/ms_accpt_103_png.png" alt="Maestro" />
          <img src="/images/mc_accpt_103_png.png" alt="MasterCard" />
        </div>
        <div
          className={cx(s.button, { [s.buttonIsActive]: this.state.cash && this.state.cash >= 1000 && this.state.email })}
          onClick={() => this.onSubmit()}
        >
          {formatMessage(messages.submitLabel)}
          <IconSVG icon="smart-arrow-right" size="14" cssClass={s.buttonIcon} />
        </div>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(PaymentOut));
