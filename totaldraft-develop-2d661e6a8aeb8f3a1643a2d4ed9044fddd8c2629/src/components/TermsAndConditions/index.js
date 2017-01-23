import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import ContentPage from 'components/ContentPage';

const messages = defineMessages({
  pageTitle: {
    id: 'termsPage.pageTitle',
    defaultMessage: 'Условия использования',
    description: 'Условия использования',
  },
});

function TermsAndConditions({ intl, content }) {
  return (
    <ContentPage title={intl.formatMessage(messages.pageTitle)}>
      <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </ContentPage>
  );
}

TermsAndConditions.propTypes = {
  intl: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(TermsAndConditions);
