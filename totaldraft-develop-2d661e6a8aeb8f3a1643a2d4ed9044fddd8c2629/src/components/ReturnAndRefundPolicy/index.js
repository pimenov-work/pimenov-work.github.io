import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import ContentPage from 'components/ContentPage';

const messages = defineMessages({
  pageTitle: {
    id: 'returnPolicy.pageTitle',
    defaultMessage: 'Политика возврата',
    description: 'Политика возврата',
  },
});

function ReturnAndRefundPolicyPage({ intl, content }) {
  return (
    <ContentPage title={intl.formatMessage(messages.pageTitle)}>
      <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </ContentPage>
  );
}

ReturnAndRefundPolicyPage.propTypes = {
  intl: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(ReturnAndRefundPolicyPage);
