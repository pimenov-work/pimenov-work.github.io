import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BlockedPage.css';
import messages from './messages';

function BlockedPage({ intl }, context){
  const { formatMessage } = intl;

  if (context.setTitle) {
    context.setTitle(formatMessage(messages.pageTitle));
  }

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.backgroundImage}></div>
        <img className={s.svgImage} src="/images/sorry.svg" role="presentation" />
      </div>
      <div className={s.footer}>
        &#169; {new Date().getFullYear()} &nbsp; <FormattedMessage {...messages.copyright} />
      </div>
    </div>
  );
}

BlockedPage.contextTypes = {
  setTitle: PropTypes.func.isRequired
};

BlockedPage.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(withStyles(s)(BlockedPage));
