import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/lib/constants.staging';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.setTag('environment', 'staging');

setInstanceBaseURL(baseURL!);

export { baseURL };
