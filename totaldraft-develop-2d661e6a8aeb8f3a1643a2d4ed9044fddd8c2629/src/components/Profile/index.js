import React, { Component, PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import { getCookie } from 'utils';
import auth from 'modules/auth';
import intlModule from 'modules/intl';
import { setLocale } from 'modules/intl/actions';
import { getRuntimeAvailableLocales } from '../../modules/runtime/selectors';
import s from './Profile.css';
import messages from './messages';

class Profile extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
    availableLocales: PropTypes.array.isRequired
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      username: props.user.name,
      passwordCurrent: null,
      passwordNew: null,
      isPasswordError: false,
      errorPasswordMessage: ''
    };
  }

  componentWillMount() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordCurrentChange(e) {
    this.setState({ passwordCurrent: e.target.value });
  }

  handlePasswordNewChange(e) {
    const { formatMessage } = this.props.intl;
    const password = e.target.value;
    this.setState({ passwordNew: password });
    if (password.length < 6 || password.length > 16) {
      this.setState({
        isPasswordError: true,
        errorPasswordMessage: formatMessage(messages.errorShortPwd)
      });
    } else {
      this.setState({ isPasswordError: false, errorPasswordMessage: '' });
    }
  }

  submitForm() {
    const { dispatch, user, currentLocale } = this.props;
    const { passwordNew, isPasswordError } = this.state;
    if (isPasswordError) return false;
    const token = getCookie('access_token');

    const userData = Object.assign(user.data, {
      l: currentLocale
    });
    let data = `name=${this.state.username}&data=${JSON.stringify(userData)}`;
    if (passwordNew) {
      data += `&password=${escape(passwordNew)}`;
    }

    return dispatch(auth.actions.userUpdate(data, token))
      .then(() => {
        if (this.state.passwordNew) {
          // Clear password fields
          this.setState({ passwordNew: '' });
          this.refs.inputPasswordNew.value = '';
        }
      });
  }

  render() {
    const { dispatch, user, filter, currentLocale, availableLocales } = this.props;
    const { ProfileFilters } = auth.constants;
    const { formatMessage } = this.props.intl;
    const isUserSetting = (filter === ProfileFilters.SHOW_USER_SETTING);
    const isChangePassword = (filter === ProfileFilters.SHOW_CHANGE_PASSWORD);
    const isChangeLang = (filter === ProfileFilters.SHOW_LANGUAGE);

    return (
      <div className={s.root}>
        <div className={s.content}>
          <div className={s.avatar}>
            <div className={s.avatarUpload}>Загрузить новое фото</div>
          </div>
          {user ?
            <div className={s.username}>{user.name}</div>
            : null
          }
          <div className={s.usermail}>{user.email}</div>
          <section className={s.form}>
            <header className={s.formHeader}>
              <div
                className={cx(s.formHeaderLabel, { [s.formHeaderLabelIsSelected]: isUserSetting })}
                onClick={() => dispatch(auth.actions.setProfileVisibilityFilter(ProfileFilters.SHOW_USER_SETTING))}
              ><FormattedMessage {...messages.userDataLabel} /></div>
              <div
                className={cx(s.formHeaderLabel, { [s.formHeaderLabelIsSelected]: isChangePassword })}
                onClick={() => dispatch(auth.actions.setProfileVisibilityFilter(ProfileFilters.SHOW_CHANGE_PASSWORD))}
              ><FormattedMessage {...messages.changePasswordLabel} /></div>
              <div
                className={cx(s.formHeaderLabel, { [s.formHeaderLabelIsSelected]: isChangeLang })}
                onClick={() => dispatch(auth.actions.setProfileVisibilityFilter(ProfileFilters.SHOW_LANGUAGE))}
              ><FormattedMessage {...messages.changeLangLabel} /></div>
              {/*
              <div
                className={cx(s.formHeaderLabel, { [s.formHeaderLabelIsSelected]: isNotifications })}
                onClick={ () => dispatch(auth.actions.setProfileVisibilityFilter(ProfileFilters.SHOW_NOTIFICATIONS)) }
              >Уведомления</div>
              */}
            </header>
            <div className={cx(s.formBlock, { [s.formBlockIsActive]: isUserSetting })}>
              <div className={s.formSectionCentered}>
                {user ?
                  <input
                    type="text"
                    placeholder={formatMessage(messages.namePlaceholder)}
                    tabIndex="1"
                    autoComplete="off"
                    ref="inputUsername"
                    value={this.state.username}
                    onChange={(e) => this.handleUsernameChange(e)}
                  />
                  : null
                }
              </div>
            </div>
            <div className={cx(s.formBlock, { [s.formBlockIsActive]: isChangePassword })}>
              <div className={s.formSectionCentered}>
                {/*
                  <input
                    type="password"
                    placeholder="СТАРЫЙ ПАРОЛЬ"
                    tabIndex="3"
                    autoComplete="off"
                    ref="inputPasswordCurrent"
                    onChange={ (e) => this.handlePasswordCurrentChange(e) }
                  />
                */}
                <input
                  type="password"
                  placeholder={formatMessage(messages.newPwdPlaceholder)}
                  tabIndex="4"
                  autoComplete="off"
                  ref="inputPasswordNew"
                  onChange={(e) => this.handlePasswordNewChange(e)}
                />
                <div className={cx(s.errorMessage, { [s.errorMessageIsActive]: this.state.isPasswordError })}>{this.state.errorPasswordMessage}</div>
              </div>
            </div>
            {/*
            <div className={cx(s.formBlock, { [s.formBlockIsActive]: isNotifications })}>
              <div className={s.formSectionCentered}>
                <Checkbox
                  label={'Я хочу получать уведомления за 2 часа до старта моих игр'}
                  cssClass={s.formCheckbox}
                />
              </div>
            </div>
            */}
            <div className={cx(s.formBlock, { [s.formBlockIsActive]: isChangeLang })}>
              <div className={s.formSectionCentered}>
                <div className={s.languages}>
                  {availableLocales.map(locale => (
                    <div
                      className={cx(s.language, { [s.languageIsActive]: locale === currentLocale })}
                      key={locale}
                      onClick={() => dispatch(setLocale({ locale }))}
                    >
                      <div
                        className={s.languageFlag}
                        style={{ backgroundImage: `url('/images/${locale.substring(0, 2)}-lang.svg')` }}
                      ></div>
                      <div className={s.languageTitle}>
                        {locale.substring(0, 2)}
                        <svg enableBackground="new 0 0 24 24" height="24px" id="Layer_1" version="1.1" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fillRule="evenodd" /></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={s.submitBtn}
              onClick={() => this.submitForm()}
            >
              <FormattedMessage {...messages.saveButtonLabel} />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    user: auth.selectors.getUser,
    filter: auth.selectors.getProfileFilter,
    currentLocale: intlModule.selectors.getLocale,
    availableLocales: getRuntimeAvailableLocales
  })
)(withStyles(s)(Profile)));
