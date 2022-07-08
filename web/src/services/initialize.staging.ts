import * as Sentry from '@sentry/browser';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/src/constants.staging';


Sentry.init({
    dsn: '__DSN__',
});
Sentry.configureScope((scope) => {
    scope.setTag('environment', 'staging');
});

setInstanceBaseURL(baseURL!);

export { baseURL };
