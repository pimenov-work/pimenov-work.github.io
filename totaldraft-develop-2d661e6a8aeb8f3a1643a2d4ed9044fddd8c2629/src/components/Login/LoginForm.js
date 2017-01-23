import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Login.css';
import SocialAuth from '../SocialAuth';
import { validateEmail } from '../../utils';
import appstate from '../../modules/appstate';
import auth from '../../modules/auth';
import mygames from '../../modules/mygames';
import { redirect } from '../../routes/actions';
import { GAME_STATUS_FREEZE } from '../../config';

const messages = defineMessages({
  passwordPlaceholder: {
    id: 'loginForm.passwordPlaceholder',
    defaultMessage: 'ПАРОЛЬ',
    description: 'ПАРОЛЬ',
  },
  invalidEmail: {
    id: 'loginForm.invalidEmail',
    defaultMessage: 'Указан неправильный email',
    description: 'Указан неправильный email',
  },
  loginBtnLabel: {
    id: 'loginForm.loginBtnLabel',
    defaultMessage: 'Войти',
    description: 'Войти',
  },
  restoreLabel: {
    id: 'loginForm.restoreLabel',
    defaultMessage: 'Забыли пароль?',
    description: 'Забыли пароль?',
  },
});

class LoginForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    authErrorMessage: PropTypes.string,
    locationPath: PropTypes.string,
    loginInformation: PropTypes.object,
    clientIP: PropTypes.string,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      email: this.props.loginInformation.email,
      password: this.props.loginInformation.password,
      isEmailError: false,
      isPasswordError: false,
      isFormError: false,
      errorMessage: ''
    };
  }

  handleEmailChange(e) {
    const { dispatch } = this.props;
    const email = e.currentTarget.value;
    this.setState({ email });
    dispatch(auth.actions.updateLoginFormInfo({ email }));
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

  handlePasswordChange(e) {
    const { dispatch } = this.props;
    const password = e.currentTarget.value;
    this.setState({ password });
    dispatch(auth.actions.updateLoginFormInfo({ password }));
  }

  handleInputKeyPress(e) {
    const { email, password, isEmailError } = this.state;

    if (e.charCode === 13 && email.trim() !== '' && password.trim() !== '' && !isEmailError) {
      this.loginSubmit(email, password);
    }
  }

  loginSubmit(email, password) {
    const { dispatch, locationPath, clientIP, loginInformation } = this.props;

    dispatch(auth.actions.loginUser(email, password, clientIP))
      .then((response) => {
        if (!response.error) {
          this.setState({
            email: loginInformation.email,
            password: loginInformation.password,
            isEmailError: false,
            isPasswordError: false,
            isFormError: false,
            errorMessage: ''
          });

          this.refs.inputEmail.value = '';
          this.refs.inputPassword.value = '';

          const { user, token } = response.data;

          if (user && user.data.r === 0) {
            dispatch(redirect('/rules-confirmation'));
            return;
          }

          if (user && token) {
            dispatch(mygames.actions.fetchMyGames(GAME_STATUS_FREEZE, token));
          }

          if (locationPath === '/' || locationPath === '/profile') {
            dispatch(redirect('/lobby'));
            setTimeout(() => dispatch(appstate.actions.hideLoginScreen()), 100);
          } else {
            dispatch(appstate.actions.hideLoginScreen());
          }
        }
      });
  }

  render() {
    const { isActive, dispatch, loginInformation, intl } = this.props;
    const formClass = cx(s.formWrapper, { [s.formWrapperIsActive]: isActive });
    const submitClass = cx(s.button, { [s.buttonIsActive]:
      this.state.email && this.state.password && !this.state.isEmailError });
    const { email, password } = this.state;
    const { AuthVisibilityFilters } = appstate.constants;
    const { formatMessage } = intl;

    return (
      <div className={formClass}>
        <SocialAuth />
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
              onKeyPress={(e) => this.handleInputKeyPress(e)}
            />
            <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isEmailError })}>{this.state.errorMessage}</div>
          </div>
          <div className={cx(s.fullFormErrorMessage, { [s.errorMessageIsActive]: this.state.isFormError })}>{this.state.errorMessage}</div>
          <div className={s.formSection}>
            <input
              type="password"
              placeholder={formatMessage(messages.passwordPlaceholder)}
              autoComplete="off"
              ref="inputPassword"
              value={loginInformation.password}
              className={cx({ [s.inputIsError]: this.state.isPasswordError || this.state.isFormError })}
              onChange={(e) => this.handlePasswordChange(e)}
              onKeyPress={(e) => this.handleInputKeyPress(e)}
            />
            <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isPasswordError })}>{this.state.errorMessage}</div>
          </div>
          <div className={s.formSectionButtons}>
            <div data-gtm="login" className={submitClass} onClick={() => this.loginSubmit(email, password)}>
              <FormattedMessage {...messages.loginBtnLabel} />
            </div>
            <div
              data-gtm="forgot-password"
              className={s.link}
              onClick={() => dispatch(appstate.actions.setAuthVisibilityFilter(AuthVisibilityFilters.SHOW_RESTORE_PASSWORD))}
            ><FormattedMessage {...messages.restoreLabel} /></div>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(connect()(withStyles(s)(LoginForm)));
