import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import ContentPage from 'components/ContentPage';

const messages = defineMessages({
  pageTitle: {
    id: 'help.pageTitle',
    defaultMessage: 'Помощь',
    description: 'Помощь',
  },
});

function Help({ intl, content }) {
  return (
    <ContentPage title={intl.formatMessage(messages.pageTitle)}>
      <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </ContentPage>
  );
}

Help.propTypes = {
  intl: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(Help);
