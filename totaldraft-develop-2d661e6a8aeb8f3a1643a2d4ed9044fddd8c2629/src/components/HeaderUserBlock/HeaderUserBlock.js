import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import s from './HeaderUserBlock.css';
import Link from '../Link';
import IconSVG from '../IconSVG';
import { getCurrencySymbol } from '../../utils';
import messages from './messages';

function HeaderUserBlock({ user, logout }) {
  return (
    <div className={s.root}>
      <div className={s.main}>
        <div className={s.user}>
          <div className={s.avatar}></div>
          <div className={s.name}>{user.name}</div>
          <div className={s.cash}>{`${user.money} ${getCurrencySymbol(user.currency)}`}</div>
        </div>
        <div className={s.menuBtn}>
          <IconSVG size="12" icon="smart-arrow-down" />
        </div>
      </div>
      <div className={s.menu}>
        <Link className={s.menuItem} to="/payments">
          <div className={s.menuItemTitle}>
            <div className={s.menuPaymentIcon}>
              <IconSVG size="9" icon="rub-icon" />
            </div>
            <FormattedMessage {...messages.withdrawal} />
          </div>
          <IconSVG size="12" icon="smart-arrow-right" cssClass={s.menuItemArrow} />
        </Link>
        <Link className={s.menuItem} to="/profile">
          <div className={s.menuItemTitle}>
            <IconSVG size="18" icon="user-icon" cssClass={s.menuProfileIcon} />
            <FormattedMessage {...messages.profile} />
          </div>
          <IconSVG size="12" icon="smart-arrow-right" cssClass={s.menuItemArrow} />
        </Link>
        <div className={s.menuItem} onClick={logout}>
          <div className={s.menuItemTitle}>
            <IconSVG size="18" icon="logout-icon" cssClass={s.menuExitIcon} />
            <FormattedMessage {...messages.exit} />
          </div>
        </div>
      </div>
    </div>
  );
}

HeaderUserBlock.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default withStyles(s)(HeaderUserBlock);
