import * as Sentry from '@sentry/browser';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/src/constants.production';


Sentry.init({
    dsn: '__DSN__',
});
Sentry.configureScope((scope) => {
    scope.setTag('environment', 'production');
});

setInstanceBaseURL(baseURL!);

export { baseURL };
