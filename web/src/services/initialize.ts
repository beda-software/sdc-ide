import { setInstanceBaseURL as setAidboxInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import { setInstanceBaseURL as setFHIRInstanceBaseURL } from 'fhir-react/lib/services/instance';

import { baseURL, juteURL, fhirpathMappingUrl } from 'shared/src/constants';

setAidboxInstanceBaseURL(baseURL);
setFHIRInstanceBaseURL(`${baseURL}/fhir`);

export { baseURL, juteURL, fhirpathMappingUrl };
