import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NotificationPanel.css';

function NotificationPanel({ appStatus }) {
  const { error, message, isPanelShown } = appStatus;

  return (
    <div className={cx(s.root, { [s.isActive]: isPanelShown, [s.isError]: error })}>
      <div className={s.message}>
        {message}
      </div>
    </div>
  );
}

NotificationPanel.propTypes = {
  appStatus: PropTypes.object.isRequired
};

export default withStyles(s)(NotificationPanel);
