import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import authModule from 'modules/auth';
import { navigate } from 'routes/actions';
import s from './RestorePassword.css';
import messages from './messages';

class RestorePassword extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    email: PropTypes.string.isRequired,
    hashKey: PropTypes.string.isRequired,
    restorePassword: PropTypes.object,
    clientIP: PropTypes.string
  };

  static contextTypes = {
    setTitle: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      password: null
    };
  }

  componentWillMount() {
    const { intl } = this.props;
    const { formatMessage } = intl;

    this.context.setTitle(formatMessage(messages.pageTitle));
  }

  componentDidMount() {
    const { dispatch, email, hashKey } = this.props;

    dispatch(authModule.actions.restorePasswordKeyCheck(email, hashKey));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(authModule.actions.clearRestorePasswordData());
  }

  handlePasswordChange(e) {
    this.setState({ password: e.currentTarget.value });
  }

  updatePassword() {
    const { dispatch, restorePassword } = this.props;
    const token = restorePassword.token;

    const data = `password=${escape(this.state.password)}`;

    dispatch(authModule.actions.userUpdate(data, token))
      .then(res => {
        if (!res.error) {
          dispatch(authModule.actions.fetchUserData(token));
          dispatch(authModule.actions.clearRestorePasswordData());

          dispatch(navigate('/'));
        }
      });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { token, errorMessage } = this.props.restorePassword;

    return (
      <div className={s.root}>
        {token ?
          <section className={s.form}>
            <div className={s.section}>
              <input
                type="password"
                placeholder={formatMessage(messages.passwordPlaceholder)}
                onChange={e => this.handlePasswordChange(e)}
              />
            </div>
            <div className={s.sectionButtons}>
              <div
                data-gtm="new-password"
                className={cx(s.button, { [s.buttonIsActive]: this.state.password && this.state.password.trim() !== '' })}
                onClick={() => this.updatePassword()}
              >{formatMessage(messages.submitLabel)}</div>
            </div>
          </section>
        :
          <div className={s.statusText}>
            {errorMessage}
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(connect(
  createStructuredSelector({
    restorePassword: authModule.selectors.getRestorePasswordData
  })
)(withStyles(s)(RestorePassword)));
