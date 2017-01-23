import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ContentPage from '../ContentPage';
import appstate from 'modules/appstate';
import messages from './messages';

function Contacts({ initInfo, intl }) {
  const { formatMessage } = intl;

  return (
    <ContentPage title={formatMessage(messages.pageTitle)}>
      <h1>{formatMessage(messages.mainTitle)}</h1>
      <h3>{formatMessage(messages.fbTitle)}</h3>
      <p>{formatMessage(messages.fbText)}: <a href="https://www.facebook.com/TotalDraft/">https://www.facebook.com/TotalDraft/</a></p>
      <h3>{formatMessage(messages.supportTitle)}:</h3>
      <p>{formatMessage(messages.supportText)}: <a href="mailto:support@totaldraft.com">support@totaldraft.com</a></p>
      <p>{initInfo.requisites}</p>
    </ContentPage>
  );
}

Contacts.propTypes = {
  initInfo: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(connect(
  createStructuredSelector({
    initInfo: appstate.selectors.getInitInfo
  })
)(Contacts));
