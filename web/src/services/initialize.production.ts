import * as Sentry from '@sentry/browser';

import { baseURL } from 'shared/lib/constants.production';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.configureScope((scope) => {
    scope.setTag('environment', 'production');
});

setInstanceBaseURL(baseURL!);

export { baseURL };
