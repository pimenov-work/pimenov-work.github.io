import React from 'react';
import App from 'components/App';
import NotFoundPage from 'components/NotFoundPage';
import ErrorPage from 'components/ErrorPage';

export default {
  path: '/error',
  action({ render, context, error }) {
    return render(
      <App context={context} error={error}>
        {error.status === 404 ? <NotFoundPage /> : <ErrorPage error={error} />}
      </App>,
      error.status || 500
    );
  }
};
