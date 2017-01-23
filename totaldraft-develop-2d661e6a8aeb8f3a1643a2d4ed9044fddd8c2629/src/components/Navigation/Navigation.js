import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Navigation.css';
import Link from '../Link';
import messages from './messages';

function Navigation({ user, path, mygames, prizes, initAppState }) {
  return (
    <div className={s.root} role="navigation">
      <Link className={s.logo} to="/">
        <img src="/images/tod_eng_green.svg" />
        <span className={s.logoName}>
        <FormattedMessage
          {...messages.brandTitle}
          values={{
            title: <span><b>ТОТАЛ</b> ДРАФТ</span>
          }}
        />
        </span>
      </Link>
      {initAppState && !initAppState.blocked ?
        <Link className={cx(s.link, { [s.linkIsActive]: path && path.indexOf('/lobby') > -1 })} to="/lobby">
          <FormattedMessage {...messages.lobby} />
        </Link>
      : null}
      {user && initAppState && !initAppState.blocked ?
        <Link
          className={cx(s.link, {
            [s.linkIsActive]: path && path.indexOf('/mygames') > -1,
            [s.isLive]: mygames && mygames.live && mygames.live.bids && mygames.live.bids.length > 0,
            [s.isPrizeAvailable]: prizes && prizes.length > 0
          })}
          to={mygames && mygames.live && mygames.live.bids && mygames.live.bids.length > 0 ? '/mygames/live' : '/mygames/future'}
        >
          <FormattedMessage {...messages.mygames} />
        </Link>
      : null }
    </div>
  );
}

Navigation.propTypes = {
  user: PropTypes.object,
  mygames: PropTypes.object,
  prizes: PropTypes.array,
  initAppState: PropTypes.object
};

export default withStyles(s)(Navigation);
