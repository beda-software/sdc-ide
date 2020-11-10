import * as Sentry from '@sentry/browser';

import { baseURL } from 'shared/lib/constants.staging';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.configureScope((scope) => {
    scope.setTag('environment', 'staging');
});

setInstanceBaseURL(baseURL!);

export { baseURL };
