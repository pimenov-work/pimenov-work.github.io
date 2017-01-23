import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import IconSVG from 'components/IconSVG';
import Link from 'components/Link';
import { getCookie } from 'utils';
import s from './PaymentAdd.css';
import { addDeposit } from '../../actions';
import messages from './messages';

class PaymentAdd extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      inputValue: null,
      isValid: false
    };
  }

  handleInputKeyDown(e) {
    const charCode = e.keyCode;
    const validKeys = [8, 9, 37, 39, 46];

    if ((charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)
      && validKeys.indexOf(charCode) === -1) {
      e.preventDefault();
    }
  }

  handleInputChange(e) {
    const value = e.currentTarget.value;

    this.setState({
      isValid: value !== '',
      inputValue: value
    });
  }

  addDeposit(moneyValue) {
    const { dispatch } = this.props;
    const token = getCookie('access_token');

    dispatch(addDeposit(moneyValue, token))
      .then(() => {
        this.setState({
          inputValue: '',
          isValid: false
        });

        this.refs.inputDeposit.value = '';
      });
  }

  render() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    return (
      <div className={s.root}>
        <div className={s.label}><FormattedMessage {...messages.formTitle} />:</div>
        <div className={s.form}>
          <input
            className={s.inputPrice}
            type="text"
            placeholder={formatMessage(messages.amountLabel)}
            tabIndex="1"
            autoComplete="off"
            ref="inputDeposit"
            maxLength="6"
            onKeyDown={(e) => this.handleInputKeyDown(e)}
            onInput={(e) => this.handleInputChange(e)}
          />
          <div
            className={cx(s.button, { [s.buttonIsActive]: this.state.isValid })}
            onClick={() => this.addDeposit(this.state.inputValue)}
          >
            <FormattedMessage {...messages.buttonLabel} />
            <IconSVG icon="check-icon" size="14" cssClass={s.buttonIcon} />
          </div>
        </div>
        <div className={s.content}>
          <p>
            <FormattedMessage
              {...messages.policyText}
              values={{
                paymentPolicyLink: <a href="/payment-policy" target="_blank" rel="noopener noreferrer"><FormattedMessage {...messages.paymentPolicyLinkText} /></a>,
                refundPolicyLink: <a href="/return-and-refund-policy" target="_blank" rel="noopener noreferrer"><FormattedMessage {...messages.refundPolicyLinkText} /></a>
              }}
            />
          </p>
          <img src="/images/payment.png" role="presentation" />
        </div>
        <div className={s.icons}></div>
      </div>
    );
  }
}

export default injectIntl(connect()(withStyles(s)(PaymentAdd)));
