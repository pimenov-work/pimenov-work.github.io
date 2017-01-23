import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormattedMessage } from 'react-intl';
import s from './RoomWinner.css';
import messages from './messages';

function RoomWinner({ winner, prize }) {
  return (
    <div className={s.root}>
      <div className={s.title}>
        <FormattedMessage {...messages.title} />!
      </div>
      <div className={s.user}>
        <div className={s.username}>{winner}</div>
      </div>
      <div className={s.label}>
        <span className={s.labelShape}></span>
        <FormattedMessage {...messages.won} />
        <span className={s.labelShape}></span>
      </div>
      <div className={s.prize}>{prize}</div>
    </div>
  );
}

RoomWinner.propTypes = {
  winner: PropTypes.string,
  prize: PropTypes.string
};

export default withStyles(s)(RoomWinner);
