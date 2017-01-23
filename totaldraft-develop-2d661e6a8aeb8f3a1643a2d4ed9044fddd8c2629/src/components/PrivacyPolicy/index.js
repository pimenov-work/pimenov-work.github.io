import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import ContentPage from 'components/ContentPage';

const messages = defineMessages({
  pageTitle: {
    id: 'privacyPolicy.pageTitle',
    defaultMessage: 'Условия безопасности данных',
    description: 'Условия безопасности данных',
  },
});

function PrivacyPolicy({ intl, content }) {
  return (
    <ContentPage title={intl.formatMessage(messages.pageTitle)}>
      <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </ContentPage>
  );
}

PrivacyPolicy.propTypes = {
  intl: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(PrivacyPolicy);
