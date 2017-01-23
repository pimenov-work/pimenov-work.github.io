import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './MyGamesNavigation.css';
import Link from 'components/Link'; // eslint-disable-line
import messages from './messages';

function MyGamesNavigation({ mygames, status, prizes }) {
  return (
    <div className={s.root}>
      {mygames && mygames.live && mygames.live.bids && mygames.live.bids.length > 0 ?
        <Link className={cx(s.navItem, { [s.navItemIsActive]: status === 'live' })} to="/mygames/live">
          <FormattedMessage {...messages.live} />
        </Link>
      : null}
      {/* <Link className={cx(s.navItem, { [s.navItemIsActive]: status === 'live' })} to="/mygames/live">
        <FormattedMessage {...messages.live} />
      </Link> */}
      <Link className={cx(s.navItem, { [s.navItemIsActive]: status === 'future' })} to="/mygames/future" >
        <FormattedMessage {...messages.future} />
      </Link>
      <Link className={cx(s.navItem, { [s.navItemIsActive]: status === 'past', [s.isPrizeAvailable]: prizes && prizes.length > 0 })} to="/mygames/past">
        <FormattedMessage {...messages.past} />
      </Link>
    </div>
  );
}

MyGamesNavigation.propTypes = {
  status: PropTypes.string,
  mygames: PropTypes.object,
  prizes: PropTypes.array
};

export default withStyles(s)(MyGamesNavigation);
