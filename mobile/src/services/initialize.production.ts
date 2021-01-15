import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/src/services/instance';

import { baseURL } from 'shared/src/constants.production';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.setTag('environment', 'production');

setInstanceBaseURL(baseURL!);

export { baseURL };
