import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Login.css';
import SocialAuth from '../SocialAuth';
import { validateEmail } from '../../utils';
import auth from '../../modules/auth';
import appstate from '../../modules/appstate';

const messages = defineMessages({
  invalidEmail: {
    id: 'restoreForm.invalidEmail',
    defaultMessage: 'Указан неправильный email',
    description: 'Указан неправильный email',
  },
  btnLabel: {
    id: 'restoreForm.btnLabel',
    defaultMessage: 'Восстановить пароль',
    description: 'Восстановить пароль',
  },
  textLabel: {
    id: 'restoreForm.textLabel',
    defaultMessage: 'Используйте адрес электронной почты, указанный при регистрации',
    description: 'Используйте адрес электронной почты, указанный при регистрации',
  },
  successMessage: {
    id: 'restoreForm.successMessage',
    defaultMessage: 'Письмо отправлено. Проверьте вашу электронную почту',
    description: 'Письмо отправлено. Проверьте вашу электронную почту',
  },
});

class RestorePassword extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    loginInformation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      email: this.props.loginInformation.email,
      isEmailError: false,
      errorMessage: ''
    };
  }

  handleEmailChange(e) {
    const { dispatch } = this.props;
    const email = e.currentTarget.value;
    this.setState({ email });
    dispatch(auth.actions.updateLoginFormInfo({ email }));
  }

  validationEmail() {
    const { email } = this.state;
    const { formatMessage } = this.props.intl;

    if (email && !validateEmail(email)) {
      this.setState({ isEmailError: true, errorMessage: formatMessage(messages.invalidEmail) });
    } else if (validateEmail(email) || email === '') {
      this.setState({ isEmailError: false, errorMessage: '' });
    }
  }

  emailSubmit(email) {
    const { dispatch } = this.props;
    const { formatMessage } = this.props.intl;

    dispatch(auth.actions.sendRestorePasswordEmail(email))
      .then((response) => {
        if (!response.error) {
          this.setState({
            email: '',
            isEmailError: false,
            isFormError: false
          });
          dispatch(auth.actions.updateLoginFormInfo({ email: '' }));

          this.refs.inputEmail.value = '';

          const statusText = formatMessage(messages.successMessage);
          dispatch(appstate.actions.showGlobalNotification(statusText));
        }
      });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const { email, isEmailError } = this.state;

    this.validationEmail();

    if (email && !isEmailError) {
      this.emailSubmit(email);
    }
  }

  render() {
    const { isActive } = this.props;
    const formClass = cx(s.formWrapper, { [s.formWrapperIsActive]: isActive });
    const submitClass = cx(s.buttonIsCentered, { [s.buttonIsActive]: this.props.loginInformation.email && !this.state.isEmailError });

    return (
      <div className={formClass}>
        <SocialAuth />
        <form action="" onSubmit={this.handleFormSubmit.bind(this)} autoComplete="off" className={s.form}>
          <div className={s.formSection}>
            <input
              type="text"
              placeholder="EMAIL"
              autoComplete="off"
              ref="inputEmail"
              value={this.props.loginInformation.email}
              className={cx({ [s.inputIsError]: this.state.isEmailError || this.state.isFormError })}
              onChange={(e) => this.handleEmailChange(e)}
              onBlur={() => this.validationEmail()}
            />
            <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isEmailError })}>{this.state.errorMessage}</div>
          </div>
          <div className={s.note}>
            <FormattedMessage {...messages.textLabel} />
          </div>
          <div className={s.formSectionButtons}>
            <button
              data-gtm="restore"
              type="submit"
              className={submitClass}
            >
              <FormattedMessage {...messages.btnLabel} />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(connect()(withStyles(s)(RestorePassword)));
