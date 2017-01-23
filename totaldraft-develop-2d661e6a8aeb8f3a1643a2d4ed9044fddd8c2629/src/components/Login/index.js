import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Login.css';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import RestorePassword from './RestorePassword';
import RulesConfirmationForm from '../RulesConfirmationForm';
import appstateModule from '../../modules/appstate';
import authModule from '../../modules/auth';

const messages = defineMessages({
  loginLabel: {
    id: 'auth.loginLabel',
    defaultMessage: 'Вход',
    description: 'Вход',
  },
  registrationLabel: {
    id: 'auth.registrationLabel',
    defaultMessage: 'Регистрация',
    description: 'Регистрация',
  },
  closeLabel: {
    id: 'auth.closeLabel',
    defaultMessage: 'Отмена',
    description: 'Отмена',
  }
});

class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired,
    authVisibilityFilter: PropTypes.string.isRequired,
    clientIP: PropTypes.string,
    statusText: PropTypes.string,
    pathname: PropTypes.string,
    loginInformation: PropTypes.object,
    user: PropTypes.object
  };

  render() {
    const { dispatch, isHidden, statusText, pathname, clientIP, loginInformation,
      authVisibilityFilter, user } = this.props;
    const { AuthVisibilityFilters } = appstateModule.constants;
    const isLoginActive = (authVisibilityFilter === AuthVisibilityFilters.SHOW_LOGIN);
    const isRegistrationActive = (authVisibilityFilter === AuthVisibilityFilters.SHOW_REGISTER);
    const isRestorePasswordActive = (authVisibilityFilter === AuthVisibilityFilters.SHOW_RESTORE_PASSWORD);
    const isRuleConfirmationActive = (authVisibilityFilter === AuthVisibilityFilters.SHOW_RULES_CONFIRMATION);

    return (
      <div className={s.root}>
        <div className={cx(s.background, { [s.backgroundScaling]: isHidden })}></div>
        <div className={s.overlay}></div>
        {!isRuleConfirmationActive ?
          <div className={s.closebtn} onClick={() => dispatch(appstateModule.actions.hideLoginScreen())}>
            <div>&times;</div>
            <label><FormattedMessage {...messages.closeLabel} /></label>
          </div>
        : null }
        <div className={s.content}>
          {!isRuleConfirmationActive ?
            <div className={s.subtitle}>
              <div
                className={cx(s.subtitleLabel, { [s.subtitleLabelIsActive]: isLoginActive })}
                onClick={() => dispatch(appstateModule.actions.setAuthVisibilityFilter(AuthVisibilityFilters.SHOW_LOGIN))}
              ><FormattedMessage {...messages.loginLabel} /></div>
              <div
                data-gtm="signup"
                className={cx(s.subtitleLabel, { [s.subtitleLabelIsActive]: isRegistrationActive })}
                onClick={() => dispatch(appstateModule.actions.setAuthVisibilityFilter(AuthVisibilityFilters.SHOW_REGISTER))}
              ><FormattedMessage {...messages.registrationLabel} /></div>
            </div>
          : null}
          <section className={s.form}>
            <LoginForm
              isActive={isLoginActive}
              dispatch={dispatch}
              authErrorMessage={statusText}
              locationPath={pathname}
              loginInformation={loginInformation}
              clientIP={clientIP}
            />
            <RegistrationForm
              isActive={isRegistrationActive}
              dispatch={dispatch}
              locationPath={pathname}
              loginInformation={loginInformation}
              clientIP={clientIP}
            />
            <RestorePassword
              isActive={isRestorePasswordActive}
              dispatch={dispatch}
              loginInformation={loginInformation}
            />
            <RulesConfirmationForm
              isActive={isRuleConfirmationActive}
              user={user}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    isHidden: appstateModule.selectors.getLoginVisibleStatus,
    authVisibilityFilter: appstateModule.selectors.getAuthVisibilityFilter,
    clientIP: authModule.selectors.getClientIp,
    statusText: authModule.selectors.getStatusMessage,
    loginInformation: authModule.selectors.getLoginInformation,
    user: authModule.selectors.getUser
  })
)(withStyles(s)(Login));
