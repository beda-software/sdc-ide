import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { baseURL, juteURL, fhirpathMappingUrl } from 'shared/src/constants';

setAidboxInstanceBaseURL(baseURL);

export { baseURL, juteURL, fhirpathMappingUrl };
