import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProtectedPage.css';
import messages from './messages';

const title = 'Страница недоступна';

function ProtectedPage({}, context) {
  if (context.setTitle) {
    context.setTitle(title);
  }

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.label}>
          <FormattedMessage {...messages.title} />
        </div>
        <div className={s.text}>
          <FormattedMessage {...messages.note} />
        </div>
      </div>
    </div>
  );
}

ProtectedPage.contextTypes = {
  setTitle: PropTypes.func.isRequired
};

export default withStyles(s)(ProtectedPage);
