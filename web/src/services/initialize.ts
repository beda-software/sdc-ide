import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { configuration }  from 'shared/src/constants';
const { baseURL, juteURL, fhirpathMappingUrl } = configuration;

setAidboxInstanceBaseURL(baseURL);

export { baseURL, juteURL, fhirpathMappingUrl };
