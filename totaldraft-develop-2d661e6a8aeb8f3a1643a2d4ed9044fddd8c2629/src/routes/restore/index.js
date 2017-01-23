import React from 'react';
import RestorePassword from 'components/RestorePassword';

export default {
  path: '/restore/:email/:key',
  async action({ params }) { // eslint-disable-line react/prop-types
    return <RestorePassword email={params.email} hashKey={params.key} />;
  },

};
