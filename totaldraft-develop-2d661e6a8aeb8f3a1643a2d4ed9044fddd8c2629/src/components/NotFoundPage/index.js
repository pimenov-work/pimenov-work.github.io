import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from 'components/Link';
import s from './NotFoundPage.css';

const messages = defineMessages({
  pageTitle: {
    id: '404page.pageTitle',
    defaultMessage: 'Страница не найдена',
    description: 'Страница не найдена',
  },
  note: {
    id: '404page.note',
    defaultMessage: 'К сожалению, страница на которую вы сослались не существует',
    description: 'К сожалению, страница на которую вы сослались не существует',
  },
  btnLabel: {
    id: '404page.btnLabel',
    defaultMessage: 'На главную',
    description: 'На главную',
  },
});

function NotFoundPage({ intl }, context) {
  if (context.setTitle) {
    context.setTitle(intl.formatMessage(messages.pageTitle));
  }

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.label}>404</div>
        <div className={s.text}>
          <FormattedMessage {...messages.note} />
        </div>
        <Link to="/" className={s.button}>
          <FormattedMessage {...messages.btnLabel} />
        </Link>
      </div>
    </div>
  );
}

NotFoundPage.contextTypes = { setTitle: PropTypes.func.isRequired };
NotFoundPage.propTypes = { intl: PropTypes.object.isRequired };

export default injectIntl(withStyles(s)(NotFoundPage));
