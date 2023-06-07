import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL } from 'shared/src/constants.develop';

setInstanceBaseURL(
    (window as any).BASE_URL === '{{BASE_URL}}' ? baseURL : (window as any).BASE_URL,
);

export { baseURL };
