import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { getIntl } from 'modules/intl/selectors';

function ProvideIntl({ intl, children }) {
  return (
    <IntlProvider
      {...intl}
      messages={intl.messages[intl.locale]}
    >
      {children}
    </IntlProvider>
  );
}

ProvideIntl.propTypes = {
  ...IntlProvider.propTypes,
  children: PropTypes.element.isRequired,
};

export default connect(
  createStructuredSelector({
    intl: getIntl,
  })
)(ProvideIntl);
