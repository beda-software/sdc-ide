import * as Sentry from '@sentry/browser';

import { baseURL } from 'shared/lib/constants.develop';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.configureScope((scope) => {
    scope.setTag('environment', 'develop');
});

setInstanceBaseURL(baseURL!);

export { baseURL };
