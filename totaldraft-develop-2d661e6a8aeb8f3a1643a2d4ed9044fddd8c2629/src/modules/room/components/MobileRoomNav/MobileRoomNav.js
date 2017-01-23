import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import s from './MobileRoomNav.css';
import messages from './messages';

function MobileRoomNav(props) {
  const { teamBuilderEnabled, isContentActive, isScheduleShown,
    isTournamentTableShown, isNewsShown, onMenuClick } = props;

  return (
    <ul className={s.root}>
      <li
        className={cx([s.item], { [s.itemIsActive]: isContentActive })}
        onClick={() => onMenuClick('participants')}
      >
        {teamBuilderEnabled
          ? <FormattedMessage {...messages.teamLabel} />
          : <FormattedMessage {...messages.membersLabel} />
        }
      </li>
      <li
        className={cx([s.item], { [s.itemIsActive]: isScheduleShown && !isContentActive })}
        onClick={() => onMenuClick('schedule')}
      >
        <FormattedMessage {...messages.scheduleLabel} />
      </li>
      <li
        className={cx([s.item], { [s.itemIsActive]: isTournamentTableShown && !isContentActive })}
        onClick={() => onMenuClick('table')}
      >
        <FormattedMessage {...messages.tableLabel} />
      </li>
      <li
        className={cx([s.item], { [s.itemIsActive]: isNewsShown && !isContentActive })}
        onClick={() => onMenuClick('news')}
      >
        <FormattedMessage {...messages.newsLabel} />
      </li>
    </ul>
  );
}

MobileRoomNav.propTypes = {
  teamBuilderEnabled: PropTypes.bool,
  isContentActive: PropTypes.bool,
  isScheduleShown: PropTypes.bool,
  isTournamentTableShown: PropTypes.bool,
  isNewsShown: PropTypes.bool,
  onMenuClick: PropTypes.func,
};

export default withStyles(s)(MobileRoomNav);
