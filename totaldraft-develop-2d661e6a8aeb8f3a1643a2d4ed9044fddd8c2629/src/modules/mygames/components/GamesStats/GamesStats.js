import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GamesStats.css';
import messages from './messages';

function GamesStats({ stats }) {
  return (
    <div className={s.root}>
      <div className={s.item}>
        <span className={s.itemLabel}>
          <FormattedMessage {...messages.bets} />:
        </span>
        <span className={s.itemText}>{stats ? stats.total : 0}</span>
      </div>
      <div className={s.item}>
        <span className={s.itemLabel}><FormattedMessage {...messages.wins} />:</span>
        <span className={s.itemText}>{stats ? stats.wins : 0}</span>
      </div>
      <div className={s.item}>
        <span className={s.itemLabel}><FormattedMessage {...messages.earnings} />:</span>
        <span className={s.itemText}>{stats ? `${stats.prize} ₽` : '0 ₽'}</span>
      </div>
    </div>
  );
}

GamesStats.propTypes = { stats: PropTypes.object };

export default withStyles(s)(GamesStats);
