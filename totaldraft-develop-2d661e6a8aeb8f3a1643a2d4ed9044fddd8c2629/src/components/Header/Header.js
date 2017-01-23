import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import s from './Header.css';
import Link from '../Link';
import IconSVG from '../IconSVG';
import Navigation from '../Navigation';
import HeaderUserBlock from '../HeaderUserBlock';
import LanguageSwitcher from '../LanguageSwitcher';
import messages from './messages';

function Header({ isHidden, user, initAppState, path, mygames, prizes, logout, showLoginScreen, isMobileMenuHidden }) {
  return (
    <div className={cx(s.root, { [s.isHidden]: isHidden, [s.isMobileMenuHidden]: isMobileMenuHidden })}>
      <div className={s.container}>
        <Navigation
          user={user}
          path={path}
          mygames={mygames}
          prizes={prizes}
          initAppState={initAppState}
        />
        {initAppState && !initAppState.blocked ?
          <div className={s.aside}>
            <Link
              className={cx(s.link, s.help, { [s.linkIsActive]: path && path.indexOf('/help') > -1 })}
              to="/help"
            >
              <IconSVG size="20" icon="question-icon" cssClass={s.svgIcon} />
              <div className={s.helpLink}>
                <FormattedMessage {...messages.help} />
              </div>
            </Link>
            {!user ? <LanguageSwitcher /> : null}
            {user ?
              <HeaderUserBlock user={user} logout={logout} />
            :
              <span className={s.link} onClick={() => showLoginScreen()} data-gtm="login-menu-link">
                <IconSVG size="20" icon="login-icon" cssClass={s.svgIcon} />
                <div className={s.loginLink}>
                  <FormattedMessage {...messages.login} />
                </div>
              </span>
            }
          </div>
        : null }
      </div>
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  initAppState: PropTypes.object,
  isHidden: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  showLoginScreen: PropTypes.func.isRequired,
  mygames: PropTypes.object,
  prizes: PropTypes.array,
  path: PropTypes.string,
  isMobileMenuHidden: PropTypes.bool
};

export default withStyles(s)(Header);
