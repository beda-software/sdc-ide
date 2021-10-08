import { baseURL } from 'shared/src/constants.develop';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

setInstanceBaseURL(baseURL!);

export { baseURL };
