import * as Sentry from '@sentry/react-native';

import { setInstanceBaseURL } from 'aidbox-react/src/services/instance';

import { baseURL } from 'shared/src/constants.staging';

Sentry.init({
    dsn: '__DSN__',
});
Sentry.setTag('environment', 'staging');

setInstanceBaseURL(baseURL!);

export { baseURL };
