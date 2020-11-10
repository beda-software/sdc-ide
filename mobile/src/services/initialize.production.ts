import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/lib/constants.production';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.setTag('environment', 'production');

setInstanceBaseURL(baseURL!);

export { baseURL };
