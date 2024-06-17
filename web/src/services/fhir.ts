import { initServices } from '@beda.software/fhir-react';

import { baseURL } from 'shared/src/constants';

export const {
    axiosInstance,
    service,
    setInstanceToken,
    resetInstanceToken,
    getFHIRResource,
    getFHIRResources,
    getAllFHIRResources,
    saveFHIRResource,
    updateFHIRResource,
    createFHIRResource,
    forceDeleteFHIRResource,
    patchFHIRResource,
    setInstanceBaseURL,
} = initServices(baseURL + '/fhir');
