import React, { PropTypes } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import ContentPage from 'components/ContentPage';

const messages = defineMessages({
  pageTitle: {
    id: 'paymentPolicy.pageTitle',
    defaultMessage: 'Политика совершения платежей',
    description: 'Политика совершения платежей',
  },
});

function PaymentPolicy({ intl, content }) {
  return (
    <ContentPage title={intl.formatMessage(messages.pageTitle)}>
      <article dangerouslySetInnerHTML={{ __html: content }}></article>
    </ContentPage>
  );
}

PaymentPolicy.propTypes = {
  intl: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
};

export default injectIntl(PaymentPolicy);
