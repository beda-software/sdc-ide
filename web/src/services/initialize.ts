import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { setInstanceBaseURL as setFHIRInstanceBaseURL } from 'fhir-react/lib/services/instance';

import { baseURL, juteURL } from 'shared/src/constants.develop';

setAidboxInstanceBaseURL(
    (window as any).BASE_URL === '{{BASE_URL}}' ? baseURL : (window as any).BASE_URL,
);
setFHIRInstanceBaseURL(
    (window as any).BASE_URL === '{{BASE_URL}}'
        ? `${baseURL}/fhir`
        : `${(window as any).BASE_URL}/fhir`,
);

export { baseURL, juteURL };
