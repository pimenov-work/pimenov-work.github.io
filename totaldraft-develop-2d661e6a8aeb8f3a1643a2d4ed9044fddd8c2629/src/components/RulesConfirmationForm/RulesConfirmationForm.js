import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Checkbox from 'components/Checkbox';
import { getCookie } from 'utils';
import { navigate } from 'routes/actions';
import appstateModule from 'modules/appstate';
import authModule from 'modules/auth';
import s from './RulesConfirmationForm.css';
import messages from './messages';

class RulesConfirmationForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    user: PropTypes.object,
    isDarkColored: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      approvedTerms: false
    };
  }

  confirmRules() {
    const { dispatch, user } = this.props;
    const token = getCookie('access_token');
    const { AuthVisibilityFilters } = appstateModule.constants;

    const userData = Object.assign(user.data, { r: 1 });
    const data = `data=${JSON.stringify(userData)}`;

    dispatch(authModule.actions.userUpdate(data, token))
      .then(res => {
        if (!res.error) {
          // dispatch(navigate('/'));
          dispatch(appstateModule.actions.hideLoginScreen());
          dispatch(appstateModule.actions.setAuthVisibilityFilter(AuthVisibilityFilters.SHOW_LOGIN));
        }
    });
  }

  render() {
    return (
      <div className={cx(s.form, { [s.isActive]: this.props.isActive, [s.isDarkColored]: this.props.isDarkColored })}>
        <div className={s.title}>
          <FormattedMessage {...messages.title} />
        </div>
        <div className={s.formSection}>
          <Checkbox
            isDarkColored={this.props.isDarkColored}
            cssClass={s.termsCheckbox}
            isChecked={this.state.approvedTerms}
            toggleCheckbox={(isChecked) => this.setState({ approvedTerms: isChecked })}
          >
            <FormattedMessage
              {...messages.confirmLabel}
              values={{
                policyLink: <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"><FormattedMessage {...messages.termsLabel} /></a>
              }}
            />
          </Checkbox>
        </div>
        <div className={s.formSection}>
          <div
            className={cx(s.button, { [s.buttonIsActive]: this.state.approvedTerms })}
            onClick={() => this.confirmRules()}
          >
            <FormattedMessage {...messages.btnLabel} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(withStyles(s)(RulesConfirmationForm));
