import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import Checkbox from '../Checkbox';
import SocialAuth from '../SocialAuth';
import { validateEmail, getURLParameterByName } from '../../utils';
import { redirect } from '../../routes/actions';
import auth from '../../modules/auth';
import appstate from '../../modules/appstate';

const messages = defineMessages({
  passwordPlaceholder: {
    id: 'regForm.passwordPlaceholder',
    defaultMessage: 'ПАРОЛЬ',
    description: 'ПАРОЛЬ',
  },
  codePlaceholder: {
    id: 'regForm.codePlaceholder',
    defaultMessage: 'РЕФЕРАЛЬНЫЙ КОД',
    description: 'РЕФЕРАЛЬНЫЙ КОД',
  },
  invalidEmail: {
    id: 'regForm.invalidEmail',
    defaultMessage: 'Указан неправильный email',
    description: 'Указан неправильный email',
  },
  invalidPasswrod: {
    id: 'regForm.invalidPassword',
    defaultMessage: 'Пароль должен быть длинной от 6 до 16 символов',
    description: 'Пароль должен быть длинной от 6 до 16 символов',
  },
  btnLabel: {
    id: 'regForm.btnLabel',
    defaultMessage: 'Присоединиться',
    description: 'Присоединиться',
  },
  refLabel: {
    id: 'regForm.refLabel',
    defaultMessage: 'Ввести реферальный код',
    description: 'Ввести реферальный код',
  },
  confirmLabel: {
    id: 'regForm.confirmLabel',
    defaultMessage: 'Я согласен с {policyLink}',
    description: 'Я согласен с {policyLink}',
  },
  policyLabel: {
    id: 'regForm.policyLabel',
    defaultMessage: 'правилами использования сайта',
    description: 'правилами использования сайта',
  }
});

const initialFormState = {
  email: '',
  password: '',
  code: '',
  name: '',
  approvedTerms: false,
  codeInputIsActive: false,
  isEmailError: false,
  isPasswordError: false,
  isFormError: false,
  errorMessage: '',
  errorPasswordMessage: ''
};

class RegistrationForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    locationPath: PropTypes.string,
    loginInformation: PropTypes.object,
    clientIP: PropTypes.string,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const refcode = (typeof window === 'object') ?
      getURLParameterByName('refcode', window.location.href) : null;

    this.state = {
      email: this.props.loginInformation.email,
      password: this.props.loginInformation.password,
      code: refcode,
      name: '',
      codeInputIsActive: refcode !== null,
      approvedTerms: false,
      isEmailError: false,
      isPasswordError: false,
      isFormError: false,
      errorMessage: '',
      errorPasswordMessage: ''
    };
  }

  handleEmailChange(e) {
    const { dispatch } = this.props;
    const email = e.currentTarget.value;
    this.setState({ email });
    this.setState({ name: email.substring(0, email.indexOf('@')) });
    dispatch(auth.actions.updateLoginFormInfo({ email }));
  }

  handlePasswordChange(e) {
    const { dispatch } = this.props;
    const { formatMessage } = this.props.intl;
    const password = e.currentTarget.value;
    if (password.length < 6 || password.length > 16) {
      this.setState({ isPasswordError: true, errorPasswordMessage: formatMessage(messages.invalidPassword) });
    } else {
      this.setState({ isPasswordError: false, errorPasswordMessage: '' });
    }
    this.setState({ password });
    dispatch(auth.actions.updateLoginFormInfo({ password }));
  }

  handleRefCodeChange(e) {
    const value = e.currentTarget.value;
    this.setState({ code: value });
  }

  validationEmail(e) {
    const email = e.currentTarget.value;
    const { formatMessage } = this.props.intl;

    if (email && !validateEmail(email)) {
      this.setState({ isEmailError: true, errorMessage: formatMessage(messages.invalidEmail) });
    } else if (validateEmail(email)) {
      this.setState({ isEmailError: false, errorMessage: '' });
    }
  }

  formSubmit(email, password, code, name) {
    const { dispatch, locationPath, clientIP } = this.props;

    dispatch(auth.actions.registerUser(email, password, code, name, clientIP))
      .then(response => {
        if (!response.error) {
          this.setState(initialFormState);

          this.refs.inputEmail.value = '';
          this.refs.inputPassword.value = '';
          if (this.refs.inputCode) {
            this.refs.inputCode.value = '';
          }

          if (locationPath === '/') {
            dispatch(redirect('/lobby'));
            setTimeout(() => dispatch(appstate.actions.hideLoginScreen()), 100);
          } else {
            dispatch(appstate.actions.hideLoginScreen());
          }
        }
      });
  }

  render() {
    const { isActive, loginInformation, intl } = this.props;
    const { email, password, code, name } = this.state;
    const { formatMessage } = intl;

    return (
      <div className={cx(s.formWrapper, { [s.formWrapperIsActive]: isActive })}>
        <SocialAuth refCode={code} />
        <form autoComplete="off">
          <div className={s.formSection}>
            <input
              type="text"
              placeholder="EMAIL"
              autoComplete="off"
              ref="inputEmail"
              value={loginInformation.email}
              className={cx({ [s.inputIsError]: this.state.isEmailError || this.state.isFormError })}
              onChange={(e) => this.handleEmailChange(e)}
              onBlur={(e) => this.validationEmail(e)}
            />
            <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isEmailError })}>{this.state.errorMessage}</div>
          </div>
          <div className={s.formSection}>
            <input
              type="password"
              placeholder={formatMessage(messages.passwordPlaceholder)}
              autoComplete="off"
              ref="inputPassword"
              value={loginInformation.password}
              onChange={(e) => this.handlePasswordChange(e)}
            />
            <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isPasswordError })}>{this.state.errorPasswordMessage}</div>
          </div>
          <div className={s.formSection}>
            {this.state.codeInputIsActive ?
              <input
                type="text"
                placeholder={formatMessage(messages.codePlaceholder)}
                autoComplete="off"
                ref="inputCode"
                value={this.state.code}
                onChange={(e) => this.handleRefCodeChange(e)}
              />
            :
              <div className={s.refCodeLink} onClick={() => this.setState({ codeInputIsActive: true })}>
                <FormattedMessage {...messages.refLabel} />
              </div>
            }
          </div>
          <div className={s.formSection}>
            <Checkbox
              cssClass={s.registrationCheckbox}
              isChecked={this.state.approvedTerms}
              toggleCheckbox={(isChecked) => this.setState({ approvedTerms: isChecked })}
            >
              <FormattedMessage
                {...messages.confirmLabel}
                values={{
                  policyLink: <a target="_blank" rel="noopener noreferrer" href="/terms-and-conditions"><FormattedMessage {...messages.policyLabel} /></a>
                }}
              />
            </Checkbox>
          </div>
          <div className={s.formSectionButtons}>
            <div
              data-gtm="join"
              className={cx(s.buttonIsCentered, { [s.buttonIsActive]: loginInformation.email && loginInformation.password && this.state.approvedTerms && !this.state.isEmailError && !this.state.isPasswordError })}
              onClick={() => this.formSubmit(email, password, code, name) }
            >
              <FormattedMessage {...messages.btnLabel} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(connect()(withStyles(s)(RegistrationForm)));
