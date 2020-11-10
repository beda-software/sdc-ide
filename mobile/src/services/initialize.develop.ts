import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/lib/constants.develop';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.setTag('environment', 'develop');

setInstanceBaseURL(baseURL!);

export { baseURL };
